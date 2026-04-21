const fs = require('fs');
const path = require('path');

const OUT = '/home/taha/Projects/logistic-replica/site-insights';
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

  // Inject before </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${scriptTag}\n</body>`);
  } else {
    // No body tag? Append
    html += `\n${scriptTag}`;
  }

  fs.writeFileSync(filePath, html);
  injected++;
  console.log(`Injected: ${file}`);
}

console.log(`\nDone! Injected into ${injected} files, skipped ${skipped}`);
