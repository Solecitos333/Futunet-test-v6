const test = require('node:test');
const assert = require('node:assert/strict');
const modulePromise = import('../js/chatbot-firebase.mjs');
test('solo selecciona productos públicos pertinentes y limita la proyección enviada a Gemini', async () => {
  const { selectProducts } = await modulePromise;
  const docs = Array.from({length: 8}, (_, i) => ({name:'projects/p/documents/products/p'+i, fields:{title:{stringValue:'Impresora Láser '+i}, price:{integerValue:'15000'}, supplierCost:{integerValue:'9000'}, secret:{stringValue:'never-send'}}}));
  docs.push({name:'products/javascript:bad',fields:{title:{stringValue:'Impresora'}}});
  const products=selectProducts(docs,'Quiero una impresora laser');
  assert.equal(products.length,5); assert.equal(products[0].price_dop,15000);
  assert.doesNotMatch(JSON.stringify(products), /supplierCost|secret|never-send|javascript:/);
  assert.equal(selectProducts(docs,'busco aire acondicionado').length,0);
});
test('rechaza respuestas inválidas y no acepta productos ni campos de ticket inventados', async () => {
  const { parseAnswer } = await modulePromise;
  const products=[{id:'real',title:'Equipo real'}];
  const answer=parseAnswer(JSON.stringify({reply:'Puedes revisar el caso.',intent:'support',product_ids:['inventado','real'],ticket:{type:'bug',title:'Un error al cotizar',description:'El botón no responde en Chrome para Android.',attempted:'x'.repeat(2000),reference:22,ownerId:'otra-persona'}}),products);
  assert.deepEqual(answer.products,products); assert.equal(answer.ticket.attempted.length,800);
  assert.equal(answer.ticket.reference,''); assert.equal(answer.ticket.ownerId,undefined);
  assert.throws(()=>parseAnswer('{bad',products)); assert.throws(()=>parseAnswer(JSON.stringify({reply:'x'.repeat(3501)}),products));
});
test('una petición cancelada no carga el proveedor ni realiza consultas', async () => {
  const { send } = await modulePromise; const controller=new AbortController(); controller.abort();
  await assert.rejects(send({message:'Hola',history:[],page:'soporte.html'},controller.signal),/aborted/);
});
