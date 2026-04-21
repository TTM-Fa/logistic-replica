/**
 * fix-lane-links.js — Fix remaining broken links in Lanes sub-tab pages
 * 
 * Fixes:
 * 1. Reefer tab links: /road/lanes/.../reefer → keep on same Standard page
 * 2. Contact support sidepanel links: /road/lanes/.../standard?sidepanel=contact-support → javascript:void(0)
 */
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, 'site-insights');

const pages = [
  'road-lanes-lane-overview-standard.html',
  'road-lanes-lane-comparison-standard.html',
  'road-lanes-yearly-comparison-standard.html',
  'road-lanes-top-movers-standard.html',
];

const replacements = [
  // Reefer tabs → point to the same standard page (no reefer scraped)
  [/href="\/road\/lanes\/lane-overview\/reefer"/g, 'href="road-lanes-lane-overview-standard.html"'],
  [/href="\/road\/lanes\/lane-comparison\/reefer"/g, 'href="road-lanes-lane-comparison-standard.html"'],
  [/href="\/road\/lanes\/yearly-comparison\/reefer"/g, 'href="road-lanes-yearly-comparison-standard.html"'],
  [/href="\/road\/lanes\/top-movers\/reefer"/g, 'href="road-lanes-top-movers-standard.html"'],
  // Contact support sidepanel links → no-op (the dialog handler will catch it)
  [/href="\/road\/lanes\/[^"]*\?sidepanel=contact-support"/g, 'href="#" data-action="contact-support"'],
];

for (const page of pages) {
  const filePath = path.join(SITE_DIR, page);
  let html = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const [pattern, replacement] of replacements) {
    const before = html;
    html = html.replace(pattern, replacement);
    if (html !== before) changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log(`✓ Fixed: ${page}`);
  } else {
    console.log(`  No changes: ${page}`);
  }
}

console.log('\nDone!');
