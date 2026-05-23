// purge_dummy_data.js
// Script to remove all dummy (placeholder) products and dummy data from the web app
// Run with Node.js: `node C:\\web\\scripts\\purge_dummy_data.js`

const fetch = require('node-fetch');

async function purgePlaceholders() {
  try {
    const response = await fetch('http://localhost:5000/api/products/purge-placeholders', { method: 'DELETE' });
    const data = await response.json();
    console.log('Backend placeholder purge:', data.message);
  } catch (err) {
    console.error('Error contacting backend:', err);
  }
}

function clearLocalStoragePlaceholders() {
  if (typeof window === 'undefined') return;
  const keys = [
    'ke_b2b_inquiries',
    'ke_custom_quotations',
    'ke_bulk_orders',
    'ke_products',
    'ke_research_assets',
    'ke_commercial_services'
  ];
  keys.forEach(key => {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = data.filter(item => !item.is_placeholder);
    if (filtered.length !== data.length) {
      localStorage.setItem(key, JSON.stringify(filtered));
      console.log(`Cleared placeholders from ${key}`);
    }
  });
  // Dispatch event to sync UI
  window.dispatchEvent(new Event('products-updated'));
}

(async () => {
  await purgePlaceholders();
  // In a browser context, you would call clearLocalStoragePlaceholders().
  // For Node, you can simulate by printing instructions.
  console.log('If running in browser console, execute clearLocalStoragePlaceholders() to clean localStorage.');
})();
