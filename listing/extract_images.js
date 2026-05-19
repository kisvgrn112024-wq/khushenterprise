const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const listingDir = __dirname;
  const pdfPath = path.join(listingDir, 'Welltrust Surgical & Ortho Aids  Broucher.pdf');
  const outputDir = path.join(listingDir, 'extracted', 'images');

  console.log('Checking for Node.js PDF image converter...');
  
  if (!fs.existsSync(path.join(listingDir, 'package.json'))) {
    fs.writeFileSync(path.join(listingDir, 'package.json'), JSON.stringify({
      name: "pdf-extractor",
      version: "1.0.0",
      private: true
    }, null, 2));
  }

  // Install pdf-img-convert
  try {
    require('pdf-img-convert');
    console.log('pdf-img-convert is already installed!');
  } catch (err) {
    console.log('Installing pdf-img-convert (this is a pure-JS package, no external tools required)...');
    execSync('npm install pdf-img-convert --no-save', { cwd: listingDir, stdio: 'inherit' });
  }

  const pdfImgConvert = require('pdf-img-convert');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Converting PDF pages into images... This may take a moment.');
  const pdfArray = await pdfImgConvert.convert(pdfPath, {
    width: 800 // High-quality width for clear cropping
  });

  console.log(`Successfully converted ${pdfArray.length} pages! Saving images...`);
  
  for (let i = 0; i < pdfArray.length; i++) {
    const pageImageFilename = `page_${i + 1}.png`;
    const pageImageFilepath = path.join(outputDir, pageImageFilename);
    fs.writeFileSync(pageImageFilepath, pdfArray[i]);
    console.log(`Saved: ${pageImageFilename}`);
  }

  console.log('\n======================================');
  console.log('✅ Image Extraction Successful!');
  console.log(`All pages saved as images in: ${outputDir}`);
  console.log('======================================\n');
}

main().catch(err => {
  console.error('Error during image extraction:', err);
});
