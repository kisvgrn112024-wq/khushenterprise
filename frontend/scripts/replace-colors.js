// scripts/replace-colors.js
const fs = require('fs');
const path = require('path');

// Directory to scan
const ROOT = path.resolve(__dirname, '../src');

// Regex patterns for hard‑coded Tailwind colors we want to replace
const patterns = [
  /bg-\[?#[0-9a-fA-F]{3,6}\]?/g, // bg-[#xxxxxx] or bg-#xxxxxx
  /bg-black\b/g,
  /bg-white\b/g,
  /text-black\b/g,
  /text-white\b/g,
  /text-gray-\d{1,3}\b/g,
  /bg-gray-\d{1,3}\b/g,
  /border-\[?#[0-9a-fA-F]{3,6}\]?/g,
  /border-black\b/g,
  /border-white\b/g,
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  patterns.forEach((pat) => {
    // Exclude brand‑specific utilities (contain "brand-")
    content = content.replace(pat, (match) => {
      if (match.includes('brand-')) return match; // keep brand colors
      // Determine replacement based on prefix
      if (match.startsWith('bg-')) return 'bg-theme';
      if (match.startsWith('text-')) return 'text-theme';
      if (match.startsWith('border-')) return 'border-theme';
      return match;
    });
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walk(ROOT);
console.log('Color replacement completed.');
