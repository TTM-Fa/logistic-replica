const fs = require('fs');
const html = fs.readFileSync('site-marketplace/spot-spotShipment.html', 'utf8');

// Count shipment items
const items = html.match(/spotfinderListItem/g);
console.log('Total spotfinderListItem occurrences:', items ? items.length : 0);

const cards = html.match(/spotFinderListItemCard/g);
console.log('Total card occurrences:', cards ? cards.length : 0);

// Use a more robust approach: use regex to find all text content in rows
// Find all row containers
const rowPattern = /class="spotfinderListItem MuiBox-root[^"]*"/g;
let match;
let count = 0;
while ((match = rowPattern.exec(html)) !== null) {
  count++;
}
console.log('Row containers found:', count);

// Extract text content from shipment rows
// Look for the pattern of loading location + date, unloading location + date, distance, equipment, shipper, deadline
const rowDataPattern = /spotfinderListItem[\s\S]*?(?=spotfinderListItem|<\/div><\/div><\/div><\/div><\/div><\/div><\/div>)/g;

// Alternative: just find all the text data in the first few hundred chars after each spotfinderListItem
let startIdx = 0;
const rowTexts = [];
for (let i = 0; i < 20; i++) {
  const idx = html.indexOf('spotfinderListItem MuiBox-root', startIdx);
  if (idx === -1) break;
  // Get the next 2000 chars and extract visible text
  const chunk = html.substring(idx, idx + 3000);
  // Extract text content between > and < 
  const texts = [];
  const textPattern = />([^<]+)</g;
  let m;
  while ((m = textPattern.exec(chunk)) !== null) {
    const t = m[1].trim();
    if (t && t.length > 1 && !t.startsWith('css-') && !t.includes('{') && !t.includes('MuiBox') && !t.includes('class=')) {
      texts.push(t);
    }
  }
  rowTexts.push(texts);
  startIdx = idx + 100;
}

console.log('\nTotal rows with data:', rowTexts.length);
rowTexts.forEach((texts, i) => {
  console.log(`\nRow ${i + 1}:`, texts.join(' | '));
});
