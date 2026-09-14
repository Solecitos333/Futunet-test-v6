// Public Firebase identifiers only. Gemini authentication is managed by Firebase.
const SITE_KEY = '6LcRGrotAAAAAAYRWm1D0MrZ5R3vDCCV-nacqwYL';
const TEMPLATE = 'futunet-support-v1';
let modelPromise;
const clean = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function selectProducts(documents, query) {
  const stop = new Set(['que', 'para', 'con', 'una', 'los', 'las', 'por', 'del', 'como', 'quiero', 'tengo', 'hola', 'necesito', 'precio', 'cuanto']);
  const words = [...new Set(normalize(query).match(/[a-z0-9]{3,}/g) || [])].filter(w => !stop.has(w));
  return documents.map(doc => {
    const f = doc.fields || {}, id = (doc.name || '').split('/').pop();
    if (!/^[A-Za-z0-9_-]{1,150}$/.test(id) || !f.title?.stringValue) return null;
    const p = { id, title: clean(f.title.stringValue, 160), brand: clean(f.brand?.stringValue, 80),
      category: clean(f.category?.stringValue, 80), description: clean(f.desc?.stringValue, 500) };
    const price = Number(f.price?.doubleValue ?? f.price?.integerValue);
    if (Number.isFinite(price) && price > 0 && price < 100000000) p.price_dop = price;
    const title = normalize(p.title), rest = normalize(p.brand + ' ' + p.category + ' ' + p.description);
    return { p, score: words.reduce((n, word) => n + (title.includes(word) ? 5 : rest.includes(word) ? 1 : 0), 0) };
  }).filter(p => p?.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(item => item.p);
}

export function parseAnswer(text, products) {
  if (typeof text !== 'string' || text.length > 15000) throw new Error('invalid');
  const answer = JSON.parse(text);
  if (typeof answer.reply !== 'string' || !answer.reply.trim() || answer.reply.length > 3500) throw new Error('invalid');
  const ids = new Set(Array.isArray(answer.product_ids) ? answer.product_ids.slice(0, 5) : []);
  let ticket = null;
  const t = answer.ticket;
  if (t && ['bug', 'complaint', 'help'].includes(t.type) && typeof t.title === 'string' && t.title.trim().length >= 5
      && typeof t.description === 'string' && t.description.trim().length >= 20) {
    ticket = { type: t.type, title: clean(t.title, 120), description: clean(t.description, 4000),
      attempted: clean(t.attempted, 800), reference: clean(t.reference, 100) };
  }
  return { reply: answer.reply, intent: ['general', 'sales', 'support', 'complaint'].includes(answer.intent) ? answer.intent : 'general',
    products: products.filter(p => ids.has(p.id)), ticket };
}

async function getModel() {
  if (!modelPromise) modelPromise = (async () => {
    const config = window.FutunetFirebase?.config;
    if (!config) throw new Error('unavailable');
    const [appSDK, checkSDK, aiSDK] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-ai.js')
    ]);
    const app = appSDK.getApps().find(a => a.name === 'futunet-public-ai') || appSDK.initializeApp(config, 'futunet-public-ai');
    const appCheck = checkSDK.initializeAppCheck(app, { provider: new checkSDK.ReCaptchaEnterpriseProvider(SITE_KEY), isTokenAutoRefreshEnabled: true });
    const model = aiSDK.getTemplateGenerativeModel(aiSDK.getAI(app, { backend: new aiSDK.GoogleAIBackend() }), { timeout: 28000 });
    return { model, appCheck, checkSDK };
  })().catch(error => { modelPromise = null; throw error; });
  return modelPromise;
}

async function publicContext(query, page, signal) {
  const context = { site: { name: 'Futunet', country: 'República Dominicana', whatsapp: '18297411041' },
    products: [], catalog_available: false, page: /^[a-z0-9-]+\.html$/.test(page) ? page : 'index.html' };
  const base = 'https://firestore.googleapis.com/v1/projects/futunet-web/databases/(default)/documents';
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 4500);
  try {
    if (signal?.aborted) throw new Error('aborted');
    const results = await Promise.allSettled([
      fetch(base + '/config/site', { credentials: 'omit', cache: 'no-store', signal: controller.signal }).then(r => r.ok ? r.json() : null),
      fetch(base + ':runQuery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', cache: 'no-store', signal: controller.signal,
        body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'products' }],
          where: { fieldFilter: { field: { fieldPath: 'isActive' }, op: 'EQUAL', value: { booleanValue: true } } },
          select: { fields: ['title', 'brand', 'category', 'desc', 'price'].map(fieldPath => ({ fieldPath })) }, limit: 500 } })
      }).then(r => r.ok ? r.json() : null)
    ]);
    const site = results[0].status === 'fulfilled' ? results[0].value?.fields : null;
    for (const key of ['siteName', 'address', 'businessHours']) if (site?.[key]?.stringValue) context.site[key] = clean(site[key].stringValue, 400);
    const rows = results[1].status === 'fulfilled' ? results[1].value : null;
    if (Array.isArray(rows)) { context.products = selectProducts(rows.flatMap(r => r.document ? [r.document] : []), query); context.catalog_available = true; }
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  return context;
}

export async function send({ message, history, page }, signal) {
  if (signal?.aborted) throw new Error('aborted');
  const turns = (Array.isArray(history) ? history : []).slice(-12).filter(t => ['user', 'model'].includes(t.role) && typeof t.text === 'string')
    .map(t => ({ role: t.role, text: t.text.slice(0, 3500) }));
  while (JSON.stringify(turns).length > 14000) turns.splice(0, 2);
  try {
    const [client, context] = await Promise.all([getModel(), publicContext(message + ' ' + turns.filter(t => t.role === 'user').slice(-2).map(t => t.text).join(' '), page, signal)]);
    await client.checkSDK.getToken(client.appCheck);
    if (signal?.aborted) throw new Error('aborted');
    const response = await client.model.generateContent(TEMPLATE, { message: clean(message, 1500), prior_messages: JSON.stringify(turns), context: JSON.stringify(context) });
    if (signal?.aborted) throw new Error('aborted');
    return parseAnswer(response.response.text(), context.products);
  } catch (error) {
    if (error.status === 429 || /429|RESOURCE_EXHAUSTED/.test(error.message || '')) throw new Error('busy');
    throw error;
  }
}
