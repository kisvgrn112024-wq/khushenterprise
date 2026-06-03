const fs = require('fs');
const path = require('path');

const backendFile = path.join(__dirname, 'backend', 'data', 'products.json');
const frontendFile = path.join(__dirname, 'frontend', 'src', 'lib', 'products.ts');

try {
  const backendData = fs.readFileSync(backendFile, 'utf8');
  let frontendData = fs.readFileSync(frontendFile, 'utf8');
  
  // We need to replace the productsDB array.
  // We can find `const productsDB: Product[] = [` and `];` and replace everything in between.
  const startMarker = 'const productsDB: Product[] = ';
  const startIndex = frontendData.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.error("Could not find start marker in products.ts");
    process.exit(1);
  }
  
  // Find the end of the array, which is the line just before `export const getProducts = (): Product[] => {`
  const exportMarker = 'export const getProducts = (): Product[] => {';
  const exportIndex = frontendData.indexOf(exportMarker);
  
  // Let's go backwards from exportIndex to find `];`
  const lastBracketIndex = frontendData.lastIndexOf('];', exportIndex);
  
  if (lastBracketIndex === -1 || lastBracketIndex < startIndex) {
    console.error("Could not find end marker in products.ts");
    process.exit(1);
  }
  
  const before = frontendData.substring(0, startIndex + startMarker.length);
  const after = frontendData.substring(lastBracketIndex + 2);
  
  const newFrontendData = before + backendData + ';\n' + after;
  
  fs.writeFileSync(frontendFile, newFrontendData);
  console.log("Successfully synced products to frontend");
} catch (e) {
  console.error("Error syncing:", e);
}
