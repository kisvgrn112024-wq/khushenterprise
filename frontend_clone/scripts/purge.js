const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/products.ts');
let content = fs.readFileSync(filePath, 'utf8');

const titlesToPurge = [
    'Professional Binocular Microscope',
    'Professional Analytical Balance',
    'Adjustable Volume Pipettes',
    'Safety Valves',
    'Eliminator Flask Set',
    'Bunsen Burner System',
    'Dux Folding Walker',
    'Welltrust Cervical Collar (Hard with Chin Support)',
    'Welltrust Lumbar Sacral (L.S.) Belt',
    'Welltrust Functional Knee Support (Neoprene)',
    'Welltrust Premium Ankle Binder',
    'Welltrust Adjustable Elbow Crutches (Pair)'
];

let totalRemoved = 0;
titlesToPurge.forEach(title => {
    // Escape regex characters
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match the JSON object block for this product
    const regex = new RegExp(`  \\{\\s*"id": "[^"]+",\\s*"title": "${escapedTitle}"[\\s\\S]*?\\},?\\n`, 'g');
    
    const matches = content.match(regex);
    if (matches) {
        totalRemoved += matches.length;
        content = content.replace(regex, '');
        console.log('Removed:', title);
    } else {
        console.log('Not found:', title);
    }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Total removed:', totalRemoved);
