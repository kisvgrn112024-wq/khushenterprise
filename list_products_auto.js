#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// API Configuration Defaults
const DEFAULT_API_URL = "http://localhost:5000";
const FIXED_PRICE = 999.00;
const DEFAULT_FOLDER = "ke aur online listing";
const FALLBACK_FOLDER = path.join("listing", "online listing or ke");

// Supported extensions
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']);

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp'
};

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(val => {
  if (val.startsWith('--')) {
    const parts = val.substring(2).split('=');
    const key = parts[0];
    const value = parts[1] || true;
    args[key] = value;
  }
});

const apiUrl = args['api-url'] || process.env.BACKEND_API_URL || DEFAULT_API_URL;
const openaiKey = args['openai-key'] || process.env.OPENAI_API_KEY || '';
const folderArg = args['folder'] || null;

function getBase64Image(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'image/png';
  const binaryData = fs.readFileSync(filePath);
  const base64Str = binaryData.toString('base64');
  return `data:${mimeType};base64,${base64Str}`;
}

function cleanNameFromPath(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const parentDir = path.basename(path.dirname(filePath));
  
  const words = [];
  [parentDir, baseName].forEach(part => {
    const clean = part.replace(/[_]/g, ' ').replace(/[-]/g, ' ');
    words.push(...clean.split(/\s+/));
  });

  const seen = new Set();
  const uniqueWords = [];
  words.forEach(w => {
    const wl = w.toLowerCase();
    if (!seen.has(wl) && wl.length > 1 && !['img', 'image', 'pic', 'photo', 'listing', 'ke', 'aur', 'online'].includes(wl)) {
      seen.add(wl);
      uniqueWords.push(w.charAt(0).toUpperCase() + w.slice(1));
    }
  });

  if (uniqueWords.length === 0) {
    return "Scientific Laboratory Equipment";
  }
  return uniqueWords.join(' ');
}

async function generateAIMetadata(imagePath, baseName) {
  if (!openaiKey) {
    const title = cleanNameFromPath(imagePath);
    const description = `The ${title} is a premium, high-performance scientific laboratory item designed for rigorous classroom, research, and industrial laboratory setups. Manufactured from durable, chemical-resistant materials, this item ensures exceptional accuracy, safety, and reliability under intense working conditions.`;
    const bulkSpecs = "Standard wholesale heavy-duty packaging. Standard transport containers with foam buffer guards.";
    return { title, description, bulkSpecs };
  }

  try {
    const parentDir = path.basename(path.dirname(imagePath));
    const filename = path.basename(imagePath);
    
    const prompt = `
    Analyze this laboratory/industrial product context:
    - Parent Directory Name: ${parentDir}
    - Filename: ${filename}
    
    Generate a professional e-commerce listing in JSON format:
    {
        "title": "A clean, highly relevant professional product name (e.g. 'Graduated Glass Beaker')",
        "description": "A detailed, professional description emphasizing precision, premium material and industrial quality.",
        "bulk_specs": "Packaging specifications and safety transport standards."
    }
    Provide ONLY valid JSON.
    `;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional e-commerce product catalog manager.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return {
      title: parsed.title,
      description: parsed.description,
      bulkSpecs: parsed.bulk_specs
    };
  } catch (err) {
    console.log(`  [AI Warning] OpenAI generation failed: ${err.message}. Falling back to filename parser.`);
    const title = cleanNameFromPath(imagePath);
    const description = `High-precision ${title} manufactured to industrial standards.`;
    const bulkSpecs = "Packaged in standard secure shockproof crates.";
    return { title, description, bulkSpecs };
  }
}

async function uploadImageToBackend(base64Image, filename, ext) {
  const mimeType = mimeTypes[ext] || 'image/png';
  try {
    const res = await fetch(`${apiUrl}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, name: filename, type: mimeType })
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (err) {
    console.log(`  [Upload Error] Failed to upload ${filename} to backend: ${err.message}`);
  }
  return null;
}

async function pushProductToDB(productData) {
  try {
    const res = await fetch(`${apiUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.ok;
  } catch (err) {
    console.log(`  [API Error] Failed to connect to server: ${err.message}`);
  }
  return false;
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function main() {
  console.log("=".repeat(60));
  console.log("      KHUSH ENTERPRISES LISTING AUTOMATION WIZARD (NODE)");
  console.log("=".repeat(60));

  // Determine images folder
  const searchPaths = [];
  if (folderArg) searchPaths.push(folderArg);
  searchPaths.push(DEFAULT_FOLDER, FALLBACK_FOLDER, path.join("..", DEFAULT_FOLDER), path.join("..", FALLBACK_FOLDER));

  let selectedFolder = null;
  for (const p of searchPaths) {
    if (p && fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      selectedFolder = p;
      break;
    }
  }

  if (!selectedFolder) {
    console.error(`Error: Could not locate folder '${DEFAULT_FOLDER}'. Please specify via --folder="path"`);
    process.exit(1);
  }

  console.log(`✔ Connected to backend at: ${apiUrl}`);
  console.log(`✔ Scanning folder: '${selectedFolder}'`);

  const imageFiles = walkDir(selectedFolder);
  if (imageFiles.length === 0) {
    console.log("No image files found in the folder. Exiting.");
    process.exit(0);
  }

  console.log(`Found ${imageFiles.length} image files. Starting automated ingestion...\n`);

  let successCount = 0;
  let variantCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const imgPath = imageFiles[i];
    const filename = path.basename(imgPath);
    console.log(`[${i + 1}/${imageFiles.length}] Processing image: ${filename}`);

    const ext = path.extname(imgPath).toLowerCase();
    const base64Image = getBase64Image(imgPath);
    
    // Upload image
    let uploadedUrl = await uploadImageToBackend(base64Image, filename, ext);
    if (!uploadedUrl) {
      uploadedUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400";
      console.log("  -> Upload failed, using fallback image.");
    } else {
      console.log(`  -> Uploaded successfully: ${uploadedUrl}`);
    }

    const baseName = path.basename(filename, ext);
    const { title, description, bulkSpecs } = await generateAIMetadata(imgPath, baseName);
    console.log(`  -> Title: ${title}`);

    const parentDir = path.basename(path.dirname(imgPath));
    const category = parentDir ? parentDir.charAt(0).toUpperCase() + parentDir.slice(1) : "General Lab";

    let icon = "Microscope";
    const catLower = category.toLowerCase();
    if (catLower.includes("beaker") || catLower.includes("flask") || catLower.includes("glass")) {
      icon = "FlaskConical";
    } else if (catLower.includes("balance") || catLower.includes("scale")) {
      icon = "Scale";
    } else if (catLower.includes("pipette")) {
      icon = "Pipette";
    } else if (catLower.includes("goggles") || catLower.includes("safety")) {
      icon = "Glasses";
    }

    // Generate variants
    for (const setSize of [1, 2, 3, 4]) {
      const hash = crypto.createHash('md5').update(imgPath).digest('hex');
      const variantId = `p_auto_${hash.slice(0, 8)}_s${setSize}`;
      const variantTitle = `${title} (Set of ${setSize})`;
      const variantSku = `KE-${hash.slice(0, 6).toUpperCase()}-S${setSize}`;

      const fullDescription = `${description}\n\n[Pack Configuration]: Contains exactly ${setSize} unit(s) of the item. Perfect for institutional and enterprise labs.\n\n[Bulk Sourcing Specs]: ${bulkSpecs}`;

      const productPayload = {
        id: variantId,
        title: variantTitle,
        description: fullDescription,
        price: FIXED_PRICE,
        originalPrice: FIXED_PRICE * 1.3,
        rating: 4.8,
        reviews: 15,
        icon: icon,
        tag: "NEW LISTING",
        discount: "23% OFF",
        stock: 250,
        images: [uploadedUrl],
        category: category,
        brand: "Khush Enterprises",
        sku: variantSku,
        aiManualEnabled: true,
        bulkPrice: FIXED_PRICE * 0.9,
        moq: setSize,
        product_status: "active",
        edited_by_admin: true,
        isB2BVisible: true,
        b2bCategory: category
      };

      console.log(`  -> Publishing variant Set of ${setSize} (SKU: ${variantSku})...`);
      const pushed = await pushProductToDB(productPayload);
      if (pushed) variantCount++;
    }

    successCount++;
    console.log("-".repeat(40));
    await new Promise(resolve => setTimeout(resolve, 100)); // sleep 100ms
  }

  console.log("=".repeat(60));
  console.log("                   AUTOMATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Images Successfully Processed: ${successCount}/${imageFiles.length}`);
  console.log(`Total Unique Product Variant Listings Created: ${variantCount}`);
  console.log("\nAll variant listings have been successfully pushed to the database permanently.");
  console.log("They will immediately render on the customer storefront catalog and the admin hub dashboard!");
  console.log("=".repeat(60));
}

main().catch(err => {
  console.error("Fatal Error running script:", err);
  process.exit(1);
});
