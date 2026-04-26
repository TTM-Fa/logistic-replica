/**
 * scrape-remaining.js — Scrape the 4 remaining visibility pages
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://app.sixfold.com';
const COMPANY_ID = '321090';
const SITE_DIR = path.join(__dirname, 'site');

const COOKIES = [
  { name: 'sixfold_tracking_consent', value: 'ok', domain: '.sixfold.com' },
  { name: 'sixfold_last_login', value: '{"type":"transporeon"}', domain: '.sixfold.com' },
  { name: 'sixfold_lng', value: 'en', domain: '.sixfold.com' },
  { name: 'sessionToken', value: 'hJd8WneMHXF6Y-r-ASeps3nYfvMHvnBFTWKiizxqdfY', domain: '.sixfold.com' },
];

const REMAINING_PAGES = [
  { name: 'fleet',              path: `/companies/${COMPANY_ID}/fleet` },
  { name: 'notifications',      path: `/companies/${COMPANY_ID}/notifications` },
  { name: 'shared-views',       path: `/companies/${COMPANY_ID}/shared-views` },
  { name: 'vehicle-management', path: `/companies/${COMPANY_ID}/vehicle-management` },
];

const ALL_PAGES = [
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

const LINK_MAP = {};
for (const p of ALL_PAGES) {
  LINK_MAP[p.path] = `${p.name}.html`;
  LINK_MAP[BASE_URL + p.path] = `${p.name}.html`;
}

async function extractAllCSS(page) {
  return page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try { for (const rule of sheet.cssRules) rules.push(rule.cssText); } catch (e) {}
    }
    return rules.join('\n');
  });
}

function cleanHTML(html) {
  html = html.replace(/<script[^>]*src="\/js\/(runtime|vendor|main|6f-vendor)[^"]*"[^>]*><\/script>/gi, '');
  html = html.replace(/<script>[\s\S]*?__EMBED_DATA__[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<iframe[^>]*intercom[^>]*>[\s\S]*?<\/iframe>/gi, '');
  html = html.replace(/<div[^>]*id="intercom[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<script[^>]*inspectlet[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*sentry[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script\s+nomodule[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<div id="loading"[^>]*>[\s\S]*?<\/div>/gi, '');
  return html;
}

function rewriteLinks(html) {
  for (const [orig, local] of Object.entries(LINK_MAP)) {
    html = html.replaceAll(`href="${orig}"`, `href="${local}"`);
    html = html.replaceAll(`href="${orig}/"`, `href="${local}"`);
  }
  return html;
}

function injectLocalCSS(html, pageName) {
  const cssFile = pageName === 'index' ? 'extracted-styles.css' : `extracted-styles-${pageName}.css`;
  html = html.replace(/<link[^>]*href="extracted-styles[^"]*\.css"[^>]*\/?>/gi, '');
  html = html.replace('</head>', `  <link rel="stylesheet" href="${cssFile}">\n</head>`);
  return html;
}

function injectInteractionsScript(html) {
  html = html.replace(/<script[^>]*src="[^"]*interactions\.js"[^>]*><\/script>/gi, '');
  html = html.replace('</body>', `  <script src="interactions.js"></script>\n</body>`);
  return html;
}

async function main() {
  console.log('🚀 Scraping remaining 4 pages...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...COOKIES);

  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('mixpanel') || url.includes('inspectlet') || url.includes('sentry') || url.includes('intercom')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const pageInfo of REMAINING_PAGES) {
    const url = BASE_URL + pageInfo.path;
    const htmlFile = `${pageInfo.name}.html`;
    const cssFile = `extracted-styles-${pageInfo.name}.css`;

    console.log(`📄 Scraping: ${pageInfo.name} (${pageInfo.path})`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 5000));

      await page.screenshot({
        path: path.join(SITE_DIR, `${pageInfo.name}-screenshot.png`),
        fullPage: true,
      });
      console.log(`  📸 Screenshot saved`);

      const css = await extractAllCSS(page);
      fs.writeFileSync(path.join(SITE_DIR, cssFile), css, 'utf8');
      console.log(`  🎨 CSS extracted (${(css.length / 1024).toFixed(1)}KB)`);

      let html = await page.content();
      html = cleanHTML(html);
      html = rewriteLinks(html);
      html = injectLocalCSS(html, pageInfo.name);
      html = injectInteractionsScript(html);

      fs.writeFileSync(path.join(SITE_DIR, htmlFile), html, 'utf8');
      console.log(`  💾 HTML saved (${(html.length / 1024).toFixed(1)}KB)`);

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ All 4 remaining pages scraped!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
