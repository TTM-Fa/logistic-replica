/**
 * inject-marketplace-interactions.js — Inject interactions.js into all marketplace HTML files
 *
 * Usage: node inject-marketplace-interactions.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'site-marketplace');
const scriptTag = '<script src="js/interactions.js" defer></script>';

const htmlFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.html'));

let injected = 0;
let skipped = 0;

for (const file of htmlFiles) {
  const filePath = path.join(OUT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('interactions.js')) {
    skipped++;
    continue;
  }

  if (html.includes('</body>')) {
    html = html.replace('</body>', `${scriptTag}\n</body>`);
  } else {
    html += `\n${scriptTag}`;
  }

  fs.writeFileSync(filePath, html);
  injected++;
  console.log(`  ✅ ${file}`);
}

console.log(`\nDone: ${injected} injected, ${skipped} already had it.`);
