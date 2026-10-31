const fs = require('fs');
const path = require('path');

const jsDir = path.resolve(__dirname, '..', 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

console.log('=== AUDITING DYNAMIC INPUTS IN JS FILES ===');

let dynamicInputsWithoutMaxlength = [];
let dynamicNumberInputsWithoutBounds = [];
let dynamicSensitiveFields = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
  
  // Find <input ...> and <textarea ...> inside strings
  const inputRegex = /<(?:input|textarea)\b([^>]*)>/gi;
  let match;
  while ((match = inputRegex.exec(content)) !== null) {
    const raw = match[0];
    const attrs = match[1];
    
    const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : (raw.startsWith('<textarea') ? 'textarea' : 'text');
    
    if (['hidden', 'checkbox', 'radio', 'submit', 'button', 'file', 'range', 'color', 'reset', 'image'].includes(type)) {
      continue;
    }
    
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : '(sin id)';
    const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
    const name = nameMatch ? nameMatch[1] : '(sin name)';
    
    if (type === 'number') {
      const hasMax = attrs.includes('max=') || attrs.includes('max="') || attrs.includes("max='");
      if (!hasMax) {
        dynamicNumberInputsWithoutBounds.push({ file, id, name, raw: raw.slice(0, 100) });
      }
      continue;
    }
    
    if (['date', 'datetime-local', 'month', 'time', 'week'].includes(type)) {
      continue;
    }
    
    if (!attrs.includes('maxlength')) {
      dynamicInputsWithoutMaxlength.push({ file, type, id, name, raw: raw.slice(0, 100) });
    }
    
    if (['password'].includes(type) || /cedula|rnc|token|pin|secret|pass|document|passport/i.test(id) || /cedula|rnc|token|pin|secret|pass|document|passport/i.test(name)) {
      if (!attrs.includes('spellcheck="false"')) {
        dynamicSensitiveFields.push({ file, type, id, name, raw: raw.slice(0, 100) });
      }
    }
  }
});

console.log('Dynamic text/email/tel inputs without maxlength in JS:', dynamicInputsWithoutMaxlength.length);
dynamicInputsWithoutMaxlength.forEach(i => console.log(`  [${i.file}] <${i.type}> id="${i.id}" name="${i.name}" -> ${i.raw}`));

console.log('Dynamic number inputs without max bounds in JS:', dynamicNumberInputsWithoutBounds.length);
dynamicNumberInputsWithoutBounds.forEach(i => console.log(`  [${i.file}] id="${i.id}" name="${i.name}" -> ${i.raw}`));

console.log('Dynamic sensitive fields without spellcheck="false" in JS:', dynamicSensitiveFields.length);
dynamicSensitiveFields.forEach(i => console.log(`  [${i.file}] id="${i.id}" name="${i.name}" -> ${i.raw}`));
