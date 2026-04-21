/**
 * scrape-visibility.js — Re-scrape Transporeon Visibility (app.sixfold.com)
 * 
 * Captures all pages with Puppeteer, extracts rendered HTML + CSS,
 * downloads assets, and produces a working offline replica in site/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ── Configuration ──────────────────────────────────────────────────────

const BASE_URL = 'https://app.sixfold.com';
const COMPANY_ID = '321090';
const SITE_DIR = path.join(__dirname, 'site');
const JS_DIR = path.join(SITE_DIR, 'js');
const ASSETS_DIR = path.join(SITE_DIR, 'assets');
const BACKUP_DIR = path.join(__dirname, 'site-backup-' + Date.now());

const COOKIES = [
  { name: 'sixfold_tracking_consent', value: 'ok', domain: '.sixfold.com' },
  { name: 'sixfold_last_login', value: '{"type":"transporeon"}', domain: '.sixfold.com' },
  { name: 'sixfold_lng', value: 'en', domain: '.sixfold.com' },
  { name: 'sessionToken', value: 'hJd8WneMHXF6Y-r-ASeps3nYfvMHvnBFTWKiizxqdfY', domain: '.sixfold.com' },
];

const PAGES = [
  { name: 'index',              path: `/companies/${COMPANY_ID}/landing-page` },
  { name: 'dashboards',         path: `/companies/${COMPANY_ID}/dashboards` },
  { name: 'transports',         path: `/companies/${COMPANY_ID}/transports` },
  { name: 'data-network',       path: `/companies/${COMPANY_ID}/data-network` },
  { name: 'analytics',          path: `/companies/${COMPANY_ID}/analytics` },
  { name: 'vehicle-management', path: `/companies/${COMPANY_ID}/vehicle-management` },
  { name: 'fleet',              path: `/companies/${COMPANY_ID}/fleet` },
  { name: 'notifications',      path: `/companies/${COMPANY_ID}/notifications` },
  { name: 'shared-views',       path: `/companies/${COMPANY_ID}/shared-views` },
];

// Build link rewrite map: original path → local filename
const LINK_MAP = {};
for (const p of PAGES) {
  LINK_MAP[p.path] = `${p.name}.html`;
  LINK_MAP[BASE_URL + p.path] = `${p.name}.html`;
}

// Track downloaded assets to avoid duplicates
const downloadedAssets = new Set();

// ── Helpers ────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (downloadedAssets.has(url)) return resolve(false);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      downloadedAssets.add(url);
      return resolve(false);
    }

    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    const cookieHeader = COOKIES.map(c => `${c.name}=${c.value}`).join('; ');
    const proto = fullUrl.startsWith('https') ? https : http;

    const req = proto.get(fullUrl, {
      headers: {
        'Cookie': cookieHeader,
        'Accept': '*/*',
        'Referer': BASE_URL + '/',
      },
      timeout: 30000,
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return downloadFile(loc, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(false);
      }
      ensureDir(path.dirname(destPath));
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on('finish', () => {
        downloadedAssets.add(url);
        resolve(true);
      });
      ws.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout: ' + url)); });
  });
}

async function extractAllCSS(page) {
  return page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          rules.push(rule.cssText);
        }
      } catch (e) { /* cross-origin sheets */ }
    }
    return rules.join('\n');
  });
}

async function discoverAssets(page) {
  return page.evaluate(() => {
    const assets = { css: [], images: [], svgSprites: [], fonts: [] };

    // CSS link elements
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      if (el.href) assets.css.push(el.getAttribute('href'));
    });

    // Images
    document.querySelectorAll('img').forEach(el => {
      if (el.src) assets.images.push(el.getAttribute('src'));
    });

    // SVG use references
    document.querySelectorAll('use').forEach(el => {
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');
      if (href) {
        const base = href.split('#')[0];
        if (base) assets.svgSprites.push(base);
      }
    });

    // Background images from inline styles
    document.querySelectorAll('[style*="background"]').forEach(el => {
      const match = el.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) assets.images.push(match[1]);
    });

    return assets;
  });
}

function cleanHTML(html) {
  // Remove vendor/runtime JS bundles
  html = html.replace(/<script[^>]*src="\/js\/(runtime|vendor|main|6f-vendor)[^"]*"[^>]*><\/script>/gi, '');

  // Remove __EMBED_DATA__ / __EMBED_CONFIG__ scripts
  html = html.replace(/<script>[\s\S]*?__EMBED_DATA__[\s\S]*?<\/script>/gi, '');

  // Remove Intercom elements
  html = html.replace(/<iframe[^>]*intercom[^>]*>[\s\S]*?<\/iframe>/gi, '');
  html = html.replace(/<div[^>]*id="intercom[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Remove Inspectlet
  html = html.replace(/<script[^>]*inspectlet[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove Sentry
  html = html.replace(/<script[^>]*sentry[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove nomodule script
  html = html.replace(/<script\s+nomodule[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove loading spinner div
  html = html.replace(/<div id="loading"[^>]*>[\s\S]*?<\/div>/gi, '');

  return html;
}

function rewriteLinks(html) {
  for (const [orig, local] of Object.entries(LINK_MAP)) {
    // Rewrite href attributes
    html = html.replaceAll(`href="${orig}"`, `href="${local}"`);
    // Also handle with trailing slash
    html = html.replaceAll(`href="${orig}/"`, `href="${local}"`);
  }
  return html;
}

function injectLocalCSS(html, pageName) {
  const cssFile = pageName === 'index' ? 'extracted-styles.css' : `extracted-styles-${pageName}.css`;
  // Remove any existing extracted-styles link
  html = html.replace(/<link[^>]*href="extracted-styles[^"]*\.css"[^>]*\/?>/gi, '');
  // Insert before </head>
  html = html.replace('</head>', `  <link rel="stylesheet" href="${cssFile}">\n</head>`);
  return html;
}

function injectInteractionsScript(html) {
  // Remove existing interactions.js reference
  html = html.replace(/<script[^>]*src="[^"]*interactions\.js"[^>]*><\/script>/gi, '');
  // Insert before </body>
  html = html.replace('</body>', `  <script src="interactions.js"></script>\n</body>`);
  return html;
}

// ── Main Scraper ───────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Transporeon Visibility scraper...\n');

  // Backup existing site
  if (fs.existsSync(SITE_DIR)) {
    console.log(`📦 Backing up existing site/ to ${path.basename(BACKUP_DIR)}/`);
    fs.cpSync(SITE_DIR, BACKUP_DIR, { recursive: true });
  }

  ensureDir(SITE_DIR);
  ensureDir(JS_DIR);
  ensureDir(ASSETS_DIR);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...COOKIES);

  // Block unnecessary resources for speed
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    // Block analytics/tracking but allow everything else
    if (url.includes('mixpanel') || url.includes('inspectlet') || url.includes('sentry') || url.includes('intercom')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  let allAssetUrls = new Set();

  for (const pageInfo of PAGES) {
    const url = BASE_URL + pageInfo.path;
    const htmlFile = `${pageInfo.name}.html`;
    const cssFile = pageInfo.name === 'index' ? 'extracted-styles.css' : `extracted-styles-${pageInfo.name}.css`;

    console.log(`\n📄 Scraping: ${pageInfo.name} (${pageInfo.path})`);

    try {
      // Navigate and wait for full render
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      // Extra wait for React to finish rendering
      await new Promise(r => setTimeout(r, 5000));

      // Take reference screenshot
      await page.screenshot({
        path: path.join(SITE_DIR, `${pageInfo.name}-screenshot.png`),
        fullPage: true,
      });
      console.log(`  📸 Screenshot saved`);

      // Extract CSS
      const css = await extractAllCSS(page);
      fs.writeFileSync(path.join(SITE_DIR, cssFile), css, 'utf8');
      console.log(`  🎨 CSS extracted (${(css.length / 1024).toFixed(1)}KB)`);

      // Discover assets
      const assets = await discoverAssets(page);
      console.log(`  🔍 Found: ${assets.css.length} CSS, ${assets.images.length} images, ${assets.svgSprites.length} SVG sprites`);

      // Collect all asset URLs
      [...assets.css, ...assets.images, ...assets.svgSprites].forEach(u => allAssetUrls.add(u));

      // Extract font URLs from CSS
      const fontUrls = css.match(/url\(["']?([^"')]+\.(woff2?|ttf|eot|otf))["']?\)/gi) || [];
      fontUrls.forEach(match => {
        const url = match.replace(/url\(["']?/, '').replace(/["']?\)/, '');
        allAssetUrls.add(url);
      });

      // Get the rendered HTML
      let html = await page.content();

      // Clean and process
      html = cleanHTML(html);
      html = rewriteLinks(html);
      html = injectLocalCSS(html, pageInfo.name);
      html = injectInteractionsScript(html);

      // Pretty-format (basic)
      fs.writeFileSync(path.join(SITE_DIR, htmlFile), html, 'utf8');
      console.log(`  💾 HTML saved (${(html.length / 1024).toFixed(1)}KB)`);

    } catch (err) {
      console.error(`  ❌ Error scraping ${pageInfo.name}: ${err.message}`);
    }
  }

  // ── Download all discovered assets ───────────────────────────────────

  console.log(`\n📥 Downloading ${allAssetUrls.size} discovered assets...`);

  for (const assetUrl of allAssetUrls) {
    try {
      let destPath;
      if (assetUrl.startsWith('/js/')) {
        destPath = path.join(SITE_DIR, assetUrl);
      } else if (assetUrl.startsWith('/assets/') || assetUrl.includes('/assets/')) {
        const relPath = assetUrl.startsWith('/') ? assetUrl : '/' + assetUrl;
        destPath = path.join(SITE_DIR, relPath);
      } else if (assetUrl.startsWith('/')) {
        destPath = path.join(SITE_DIR, assetUrl);
      } else if (assetUrl.startsWith('http')) {
        // External URL — extract filename
        const urlObj = new URL(assetUrl);
        destPath = path.join(SITE_DIR, urlObj.pathname);
      } else {
        destPath = path.join(SITE_DIR, assetUrl);
      }

      const downloaded = await downloadFile(assetUrl, destPath);
      if (downloaded) {
        console.log(`  ✅ ${path.basename(destPath)}`);
      }
    } catch (err) {
      console.log(`  ⚠️  Failed: ${assetUrl} — ${err.message}`);
    }
  }

  await browser.close();

  // ── Summary ──────────────────────────────────────────────────────────

  console.log('\n' + '═'.repeat(60));
  console.log('✅ Scraping complete!');
  console.log(`📁 Output: ${SITE_DIR}/`);
  console.log(`📦 Backup: ${path.basename(BACKUP_DIR)}/`);
  console.log('');
  console.log('Pages scraped:');
  for (const p of PAGES) {
    const f = `${p.name}.html`;
    const fp = path.join(SITE_DIR, f);
    const size = fs.existsSync(fp) ? `${(fs.statSync(fp).size / 1024).toFixed(1)}KB` : 'MISSING';
    console.log(`  ${f.padEnd(30)} ${size}`);
  }
  console.log('\nNext steps:');
  console.log('  npx serve site    # Start on :3002');
  console.log('  # Compare with original at app.sixfold.com');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
