/**
 * inject-visibility-interactions.mjs
 * Injects <script src="js/interactions.js"></script> into all site/ HTML pages.
 * Idempotent — skips pages that already have the script tag.
 *
 * Usage: node inject-visibility-interactions.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SITE_DIR = join(import.meta.dirname, 'site');
const SCRIPT_TAG = '<script src="js/interactions.js"></script>';

const htmlFiles = readdirSync(SITE_DIR).filter(f => f.endsWith('.html'));
let injected = 0;

for (const file of htmlFiles) {
  const filePath = join(SITE_DIR, file);
  let html = readFileSync(filePath, 'utf8');

  if (html.includes('js/interactions.js')) {
    console.log(`  ⏭ ${file} — already has interactions.js`);
    continue;
  }

  // Inject before </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `  ${SCRIPT_TAG}\n</body>`);
  } else {
    // Fallback: append at end
    html += `\n${SCRIPT_TAG}\n`;
  }

  writeFileSync(filePath, html, 'utf8');
  console.log(`  ✅ ${file} — injected`);
  injected++;
}

console.log(`\nDone. Injected into ${injected} of ${htmlFiles.length} files.`);
