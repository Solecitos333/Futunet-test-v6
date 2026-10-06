const fs = require('fs');
const content = fs.readFileSync('tools/seed-suggestions.cjs', 'utf8');

const regex = /refCode:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"]/g;
let match;
const list = [];
while ((match = regex.exec(content)) !== null) {
  list.push({ code: match[1], title: match[2] });
}
console.log('Total suggestions in seed script:', list.length);
list.forEach(item => console.log(item.code, ':', item.title.slice(0, 60)));
