const fs = require('fs');
const content = fs.readFileSync('js/inventory_data.js', 'utf8');
const match = content.match(/const\s+mockDatabase\s*=\s*(\[.*\]);/s);
if (match) {
  try {
    const data = (new Function('return ' + match[1]))();
    const keywords = ['LAMINADO', 'FERRETERO', 'TABLA', 'VELA', 'SILICON'];
    
    const relevant = data.filter(i => 
      keywords.some(kw => i.title.toUpperCase().includes(kw))
    );
    
    relevant.forEach(i => console.log(`${i.id}: ${i.title} (Current img: ${i.img})`));
  } catch(e) {
    console.error("Evaluation failed", e);
  }
}
