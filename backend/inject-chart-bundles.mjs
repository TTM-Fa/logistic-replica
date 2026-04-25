#!/usr/bin/env node
/**
 * Inject chart bundle script/link tags into Lanes + Rates HTML pages.
 * Idempotent: will not double-inject if already present.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteDir = join(__dirname, 'site-insights');

const pages = [
  // Lanes
  { html: 'road-lanes-lane-overview-standard.html',   bundle: 'lane-overview',    css: 'lane-overview' },
  { html: 'road-lanes-lane-comparison-standard.html', bundle: 'lane-comparison',  css: 'lane-overview' },
  { html: 'road-lanes-yearly-comparison-standard.html', bundle: 'yearly-comparison', css: 'lane-overview' },
  { html: 'road-lanes-top-movers-standard.html',      bundle: 'top-movers',       css: 'lane-overview' },
  // Rates
  { html: 'road-rates.html',                   bundle: 'rates-overview',   css: 'rates-overview' },
  { html: 'road-rates-overview.html',          bundle: 'rates-overview',   css: 'rates-overview' },
  { html: 'road-capacity.html',                bundle: 'capacity',         css: 'capacity' },
  { html: 'road-rates-spot-vs-contract.html',  bundle: 'spot-vs-contract', css: 'spot-vs-contract' },
];

for (const { html, bundle, css } of pages) {
  const filePath = join(siteDir, html);
  if (!existsSync(filePath)) {
    console.log(`  ${html}: file not found, skipping`);
    continue;
  }

  let content = readFileSync(filePath, 'utf-8');

  const scriptTag = `<script src="/js/${bundle}.bundle.js"></script>`;

  if (content.includes(scriptTag)) {
    console.log(`  ${html}: already injected, skipping`);
    continue;
  }

  // Inject CSS before </head> if not present
  const cssFile = `${css}.bundle.css`;
  const cssTag = `<link rel="stylesheet" href="/js/${cssFile}">`;
  if (!content.includes(cssFile)) {
    content = content.replace('</head>', `${cssTag}\n</head>`);
  }

  // Inject script before </body>
  const injection = `\n<!-- injected chart bundle -->\n${scriptTag}\n`;
  content = content.replace('</body>', injection + '</body>');

  writeFileSync(filePath, content, 'utf-8');
  console.log(`  ${html}: injected ${bundle}.bundle.js`);
}

console.log('\nDone.');
