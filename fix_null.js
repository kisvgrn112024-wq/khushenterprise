const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/"imageUrl": null/g, '"imageUrl": ""');
  fs.writeFileSync(filePath, content);
}

fixFile('backend/data/products.json');
fixFile('frontend/src/lib/products.ts');
console.log('Fixed nulls');
