const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('=== AUDIT REPORT: FORMS & INPUTS ===');
console.log('Total HTML files:', htmlFiles.length);

let totalForms = 0;
let formsWithoutHp = [];
let formsWithoutPrivacy = [];
let inputsWithoutMaxlength = [];
let passwordFields = [];
let sensitiveFieldsWithoutSpellcheckFalse = [];
let numberInputsWithoutMaxOrBounds = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  
  // Find all forms
  const formRegex = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
  let formMatch;
  while ((formMatch = formRegex.exec(content)) !== null) {
    totalForms++;
    const formAttrs = formMatch[1];
    const formBody = formMatch[2];
    
    // Extract form id or class
    const idMatch = formAttrs.match(/id=["']([^"']+)["']/i);
    const formId = idMatch ? idMatch[1] : '(sin id)';
    
    // Check honeypot
    const hasHp = formBody.includes('_hp_security_check');
    if (!hasHp) {
      formsWithoutHp.push({ file, formId });
    }
    
    // Check if form has PII inputs (email, tel, nombre, cedula, rnc)
    const hasPII = /type=["'](email|tel)["']|name=["'](email|phone|tel|nombre|name|cedula|rnc)["']/i.test(formBody);
    const hasPrivacy = formBody.includes('privacidad.html') || formBody.includes('terminos.html') || /privacy|consent|terms/i.test(formBody);
    if (hasPII && !hasPrivacy) {
      formsWithoutPrivacy.push({ file, formId });
    }
  }
  
  // Check inputs without maxlength
  const inputRegex = /<(input|textarea)\b([^>]*)>/gi;
  let inputMatch;
  while ((inputMatch = inputRegex.exec(content)) !== null) {
    const tag = inputMatch[1].toLowerCase();
    const attrs = inputMatch[2];
    
    const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : (tag === 'textarea' ? 'textarea' : 'text');
    
    // ignore non-text inputs
    if (['hidden', 'checkbox', 'radio', 'submit', 'button', 'file', 'range', 'color', 'reset', 'image'].includes(type)) {
      continue;
    }
    
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : '(sin id)';
    const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
    const name = nameMatch ? nameMatch[1] : '(sin name)';
    
    if (type === 'number') {
      const hasMax = attrs.includes('max=');
      if (!hasMax) {
        numberInputsWithoutMaxOrBounds.push({ file, id, raw: inputMatch[0].trim() });
      }
      continue;
    }

    if (['date', 'datetime-local', 'month', 'time', 'week'].includes(type)) {
      continue;
    }

    if (!attrs.includes('maxlength')) {
      inputsWithoutMaxlength.push({ file, tag, type, id, name, raw: inputMatch[0].trim() });
    }
    
    if (type === 'password') {
      const hasAutocomplete = attrs.includes('autocomplete');
      passwordFields.push({ file, id, hasAutocomplete, raw: inputMatch[0].trim() });
    }

    // Check sensitive inputs (password, credit card, tokens, cedula, rnc, document, passport) without spellcheck="false"
    if (['password'].includes(type) || /cedula|rnc|token|pin|secret|pass|document|passport/i.test(id) || /cedula|rnc|token|pin|secret|pass|document|passport/i.test(name)) {
      if (!attrs.includes('spellcheck="false"')) {
        sensitiveFieldsWithoutSpellcheckFalse.push({ file, id, name, type, raw: inputMatch[0].trim() });
      }
    }
  }
});

console.log('Total forms found:', totalForms);
console.log('Forms without Honeypot:', formsWithoutHp.length);
formsWithoutHp.forEach(f => console.log('  -', f.file, 'Form ID:', f.formId));

console.log('Forms with PII without Privacy Consent:', formsWithoutPrivacy.length);
formsWithoutPrivacy.forEach(f => console.log('  -', f.file, 'Form ID:', f.formId));

console.log('=== TEXT/EMAIL/TEL/SEARCH INPUTS WITHOUT MAXLENGTH ===');
console.log('Count:', inputsWithoutMaxlength.length);
inputsWithoutMaxlength.forEach(i => console.log(`  [${i.file}] <${i.tag}> id="${i.id}" name="${i.name}" type="${i.type}" -> ${i.raw}`));


console.log('Number inputs without max bound:', numberInputsWithoutMaxOrBounds.length);
numberInputsWithoutMaxOrBounds.forEach(n => console.log('  -', n.file, 'id=' + n.id, '->', n.raw));

console.log('Password fields:', passwordFields.length);
passwordFields.forEach(p => console.log('  -', p.file, 'id=' + p.id, 'hasAutocomplete:', p.hasAutocomplete, '->', p.raw));

console.log('Sensitive fields without spellcheck="false":', sensitiveFieldsWithoutSpellcheckFalse.length);
sensitiveFieldsWithoutSpellcheckFalse.forEach(s => console.log('  -', s.file, s.type, 'id=' + s.id, 'name=' + s.name));
