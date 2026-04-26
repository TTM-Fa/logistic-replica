/**
 * scrape-marketplace.js — Scrape Transporeon Freight Marketplace
 *
 * Captures all pages with Puppeteer, extracts rendered HTML + CSS,
 * downloads assets, captures API responses, and produces a working
 * offline replica in site-marketplace/
 *
 * Usage:
 *   node scrape-marketplace.js                  # Auto-discover & scrape all pages
 *   node scrape-marketplace.js --pages-only     # Only discover pages, don't scrape
 *   node scrape-marketplace.js --skip-assets    # Scrape HTML/CSS but skip asset download
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ── Configuration ──────────────────────────────────────────────────────

const BASE_URL = 'https://marketplace.transporeon.com';
const SITE_DIR = path.join(__dirname, 'site-marketplace');
const JS_DIR = path.join(SITE_DIR, 'js');
const ASSETS_DIR = path.join(SITE_DIR, 'assets');
const SCREENSHOTS_DIR = path.join(SITE_DIR, 'screenshots');
const API_DATA_DIR = path.join(__dirname, 'api-data', 'marketplace');

// Parse cookie string into Puppeteer cookie objects
// Parse cookie string into Puppeteer cookie objects
const COOKIE_STRING = `_hjSessionUser_1928879=eyJpZCI6IjVjY2YwM2Y0LWM5MGItNWI1ZC04OWUyLTk4YjZlMTRiMzM1ZSIsImNyZWF0ZWQiOjE3NzQ0Mzk5NTg3NDksImV4aXN0aW5nIjpmYWxzZX0=; apt.uid=AP-IMFEHHOHPTJW-2-1774440003707-17717489.0.2.28a0690a-084a-453a-a29d-848970e0907c; _hjSessionUser_3213209=eyJpZCI6IjA3YTE5Y2JkLWYyZGQtNWIzZS04ODkxLWIwNDVmYjk1NzNhOSIsImNyZWF0ZWQiOjE3NzQ0NDAwMDM1NjgsImV4aXN0aW5nIjp0cnVlfQ==; __insp_uid=505532444; __insp_wid=690892928; __insp_nv=false; __insp_targlpu=aHR0cHM6Ly9hcS50cmFuc3BvcmVvbi5jb20vcnVsZXM%3D; __insp_targlpt=UnVsZSBtYW5hZ2VyIGRhc2hib2FyZCB8IEF1dG9ub21vdXMgUXVvdGF0aW9u; __insp_identity=OTk2OTI1Ng%3D%3D; __insp_sid=3130018884; mp_247da6f10d9270bcc51145b8b0693fd4_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%222cad9ba8-4400-430a-ac66-bccb6a9b2943%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; __insp_pad=2; __insp_slim=1774789102962; tpsso=2s1bZTRu3fgsFQbVKUicLkeDxhrCDzOZbqRRXWGQrz6zsbyC6Rgkys6Wh1L2vQnL; tpsso_external=cBdmYR8879QQUSjD3XS3zSlcNMrxgfaGUmv3Y8POOJbo8aNv01IxZNWY1h3VKh5f; LOCALE=en_US; mp_d32aea635c956df8635890053bef59da_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%22680c3460-60fe-45c6-b2b0-28598a1c37ef%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; apt.sid=AP-IMFEHHOHPTJW-2-1775485187329-81613242; _hjSession_3213209=eyJpZCI6ImI0MTg4OWYwLTlkYjctNDI5OS1iMWNmLTNhZWZkYWQyODNmMCIsImMiOjE3NzU0ODUxOTM2MzQsInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _dd_s=rum=2&id=cd8bab91-f22c-492a-a981-d5ae2be2aae9&created=1775485186266&expire=1775486177376`;

function parseCookieString(cookieStr, domain) {
  return cookieStr.split('; ').map(pair => {
    const eqIdx = pair.indexOf('=');
    const name = pair.substring(0, eqIdx);
    const value = pair.substring(eqIdx + 1);
    return { name, value, domain, path: '/' };
  });
}

const COOKIES = parseCookieString(COOKIE_STRING, '.transporeon.com');

// Track downloaded assets
const downloadedAssets = new Set();

// Captured API responses
const capturedAPIs = [];

// Dynamic page detection results
const dynamicPageReport = [];

// ── CLI flags ──────────────────────────────────────────────────────────

const PAGES_ONLY = process.argv.includes('--pages-only');
const SKIP_ASSETS = process.argv.includes('--skip-assets');

// ── Helpers ────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Convert a URL path to a safe filename.
 *   /home            → index
 *   /freight/loads   → freight-loads
 *   /settings/users  → settings-users
 */
function pathToName(urlPath) {
  let cleaned = urlPath.replace(/^\/+|\/+$/g, '');
  // Decode URI components and sanitize
  try { cleaned = decodeURIComponent(cleaned); } catch {}
  if (cleaned === 'home' || cleaned === '') return 'index';
  // Replace non-alphanumeric chars (except hyphens) with hyphens
  return cleaned.replace(/\//g, '-').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
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
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return downloadFile(loc, destPath).then(resolve).catch(reject);
        res.resume();
        return resolve(false);
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

// ── CSS Extraction ─────────────────────────────────────────────────────

async function extractAllCSS(page) {
  return page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) rules.push(rule.cssText);
      } catch (e) { /* cross-origin sheets */ }
    }
    return rules.join('\n');
  });
}

// ── Asset Discovery ────────────────────────────────────────────────────

async function discoverAssets(page) {
  return page.evaluate(() => {
    const assets = { css: [], images: [], svgSprites: [], fonts: [] };

    // CSS link elements
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href) assets.css.push(href);
    });

    // Images
    document.querySelectorAll('img').forEach(el => {
      const src = el.getAttribute('src');
      if (src) assets.images.push(src);
    });

    // SVG use references (icon sprites)
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

    // Favicons and other link resources
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href) assets.images.push(href);
    });

    return assets;
  });
}

// ── Dynamic Content Detection ──────────────────────────────────────────

async function detectDynamicContent(page) {
  return page.evaluate(() => {
    const indicators = {
      hasCanvas: document.querySelectorAll('canvas').length > 0,
      canvasCount: document.querySelectorAll('canvas').length,
      hasCharts: document.querySelectorAll('[class*="chart"], [class*="Chart"], .recharts-wrapper, .highcharts-container, [data-chart]').length > 0,
      chartCount: document.querySelectorAll('[class*="chart"], [class*="Chart"], .recharts-wrapper, .highcharts-container, [data-chart]').length,
      hasDataTables: false,
      tableRowCount: 0,
      hasLoadingSpinners: document.querySelectorAll('[class*="spinner"], [class*="loading"], [class*="skeleton"], .MuiCircularProgress-root, .MuiSkeleton-root').length > 0,
      hasDataGrids: document.querySelectorAll('[class*="grid"], [role="grid"], .MuiDataGrid-root, .ag-root').length > 0,
      hasMaps: document.querySelectorAll('[class*="map"], .leaflet-container, .mapboxgl-map, [class*="Map"]').length > 0,
    };

    // Check for data tables with significant rows
    const tables = document.querySelectorAll('table, [role="table"]');
    for (const table of tables) {
      const rows = table.querySelectorAll('tr, [role="row"]');
      if (rows.length > 5) {
        indicators.hasDataTables = true;
        indicators.tableRowCount = Math.max(indicators.tableRowCount, rows.length);
      }
    }

    return indicators;
  });
}

// ── Page Discovery ─────────────────────────────────────────────────────

async function discoverPages(page) {
  console.log('🔍 Discovering pages from navigation...\n');

  // Step 1: Navigate to /home (login page) and trigger SSO sign-in flow
  console.log('   Step 1: Navigating to login page...');
  await page.goto(BASE_URL + '/home', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3000);

  let landingUrl = page.url();
  console.log(`   Current URL: ${landingUrl}`);

  // Check if we're on the login page
  const isLoginPage = await page.evaluate(() => {
    const text = document.body?.innerText || '';
    return text.includes('Please sign in') || text.includes('Welcome to Freight Marketplace') || text.includes('Sign In');
  });

  if (isLoginPage) {
    console.log('   📋 On login page — attempting SSO sign-in flow...');

    // Look for the Sign In button and click it to trigger SSO redirect
    const signInClicked = await page.evaluate(() => {
      // Find the Sign In button (not the "Sign Up" link)
      const buttons = [...document.querySelectorAll('button, a, [role="button"]')];
      const signInBtn = buttons.find(b => {
        const text = b.textContent.trim();
        return text === 'Sign In' || text === 'Sign in' || text === 'LOGIN' || text === 'Log In';
      });
      if (signInBtn) {
        signInBtn.click();
        return signInBtn.textContent.trim();
      }
      return null;
    });

    if (signInClicked) {
      console.log(`   🔑 Clicked "${signInClicked}" button — waiting for SSO redirect...`);
      // Wait for SSO redirect chain to complete
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      } catch { /* may already have navigated */ }
      await sleep(5000);
    } else {
      // Maybe the sign-in is triggered via a link with specific href
      const ssoUrl = await page.evaluate(() => {
        const links = [...document.querySelectorAll('a[href]')];
        const ssoLink = links.find(a => {
          const href = a.href || '';
          return href.includes('sso') || href.includes('auth') || href.includes('oauth') ||
                 href.includes('login') || href.includes('identity') || href.includes('account.transporeon');
        });
        return ssoLink ? ssoLink.href : null;
      });

      if (ssoUrl) {
        console.log(`   🔑 Found SSO link: ${ssoUrl}`);
        await page.goto(ssoUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(5000);
      } else {
        console.log('   ⚠️  No sign-in button or SSO link found');
      }
    }

    landingUrl = page.url();
    console.log(`   After SSO: ${landingUrl}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '_after-sso.png'), fullPage: true });
    console.log(`   📸 Post-SSO screenshot saved`);
  }

  // Check again if we're authenticated
  const stillOnLogin = await page.evaluate(() => {
    const text = document.body?.innerText || '';
    return text.includes('Please sign in') || text.includes('Welcome to Freight Marketplace');
  });

  if (stillOnLogin) {
    console.log('\n   ℹ️  SSO flow did not authenticate. Trying direct SSO URL...');

    // Try the Transporeon SSO exchange directly
    // Set cookies on the SSO domain too
    const ssoCookies = COOKIES
      .filter(c => c.name === 'tpsso' || c.name === 'tpsso_external' || c.name === 'LOCALE')
      .map(c => ({ ...c, domain: '.transporeon.com' }));
    await page.setCookie(...ssoCookies);

    // Try common Transporeon SSO endpoints
    const ssoEndpoints = [
      'https://account.transporeon.com/auth/realms/transporeon/protocol/openid-connect/auth?client_id=marketplace&redirect_uri=' + encodeURIComponent(BASE_URL + '/'),
      'https://sso.transporeon.com/auth?redirect=' + encodeURIComponent(BASE_URL + '/'),
    ];

    for (const ssoUrl of ssoEndpoints) {
      console.log(`   Trying SSO: ${ssoUrl.substring(0, 80)}...`);
      try {
        await page.goto(ssoUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        await sleep(3000);
        landingUrl = page.url();
        console.log(`   Landed: ${landingUrl}`);
        if (landingUrl.startsWith(BASE_URL) && !landingUrl.includes('/home')) {
          console.log('   ✅ SSO redirected to app!');
          break;
        }
      } catch (e) {
        console.log(`   ⚠️  SSO endpoint failed: ${e.message}`);
      }
    }
  }

  // Final check — are we in the app?
  const currentUrl = page.url();
  const finalCheck = await page.evaluate(() => {
    const text = document.body?.innerText || '';
    return {
      isLogin: text.includes('Please sign in') || text.includes('Welcome to Freight Marketplace'),
      text: text.substring(0, 300),
    };
  });

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '_discovery-final.png'), fullPage: true });

  if (finalCheck.isLogin) {
    console.log('\n   ── DEBUG INFO ──');
    console.log(`   Final URL: ${currentUrl}`);
    console.log(`   Page text: ${finalCheck.text.substring(0, 200)}`);

    // Dump cookies
    const browserCookies = await page.cookies();
    console.log(`\n   Browser has ${browserCookies.length} cookies:`);
    for (const c of browserCookies) {
      if (['tpsso', 'tpsso_external', 'LOCALE', 'JSESSIONID', 'connect.sid'].includes(c.name) ||
          c.name.includes('session') || c.name.includes('token') || c.name.includes('auth')) {
        console.log(`     ${c.name} = ${c.value.substring(0, 30)}... (domain: ${c.domain})`);
      }
    }

    // Dump all links
    const allLinks = await page.evaluate(() =>
      [...document.querySelectorAll('a[href], button')].map(el => ({
        tag: el.tagName,
        href: el.getAttribute('href') || '',
        text: el.textContent.trim().substring(0, 60),
        onclick: el.getAttribute('onclick') || '',
      })).filter(l => l.text)
    );
    console.log('\n   Interactive elements on page:');
    for (const l of allLinks) {
      console.log(`     <${l.tag}> "${l.text}" ${l.href ? 'href=' + l.href : ''} ${l.onclick ? 'onclick=...' : ''}`);
    }

    console.log('\n❌ Could not authenticate. The tpsso cookie may need to be refreshed.');
    console.log('   The marketplace likely uses OAuth/SSO — you may need to:');
    console.log('   1. Log in to marketplace.transporeon.com in Chrome');
    console.log('   2. After sign-in, BEFORE the page fully loads, open DevTools > Network tab');
    console.log('   3. Copy the full cookie header from ANY request to marketplace.transporeon.com');
    console.log('   4. Look for cookies like JSESSIONID, connect.sid, or auth_token');
    console.log('      (the marketplace app may use its OWN session cookie separate from tpsso)');
  }

  // Extract all internal links from navigation elements and the full page
  const links = await page.evaluate((baseUrl) => {
    const found = new Set();

    // Priority: sidebar nav links, main nav, header nav
    const navSelectors = [
      'nav a[href]',
      '[role="navigation"] a[href]',
      '[class*="sidebar"] a[href]',
      '[class*="Sidebar"] a[href]',
      '[class*="nav"] a[href]',
      '[class*="Nav"] a[href]',
      '[class*="menu"] a[href]',
      '[class*="Menu"] a[href]',
      'aside a[href]',
      'header a[href]',
      // General links as fallback
      'a[href]',
    ];

    for (const sel of navSelectors) {
      document.querySelectorAll(sel).forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;

        // Resolve relative URLs
        let fullUrl;
        try {
          fullUrl = new URL(href, baseUrl).href;
        } catch { return; }

        // Only same-origin marketplace links
        if (!fullUrl.startsWith(baseUrl)) return;

        const urlPath = new URL(fullUrl).pathname;

        // Skip anchors, assets, auth endpoints
        if (urlPath.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|ico|json|xml)$/i)) return;
        if (urlPath.startsWith('/api/')) return;
        if (urlPath.startsWith('/auth/')) return;
        if (urlPath.startsWith('/oauth/')) return;
        if (urlPath === '/') return;

        found.add(urlPath);
      });
    }

    return [...found];
  }, BASE_URL);

  // Always include /home
  const paths = new Set(['/home']);
  for (const link of links) paths.add(link);

  // Build page list
  const pages = [...paths].sort().map(p => ({
    name: pathToName(p),
    path: p,
    url: BASE_URL + p,
  }));

  console.log(`📋 Discovered ${pages.length} pages:`);
  for (const p of pages) {
    console.log(`   ${p.name.padEnd(40)} ${p.path}`);
  }
  console.log('');

  return pages;
}

// ── HTML Cleaning ──────────────────────────────────────────────────────

function cleanHTML(html) {
  // Remove all <script> tags (SPA runtime, vendor bundles, analytics)
  // Keep only type="application/ld+json" (structured data) if present
  html = html.replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove remaining self-closing scripts
  html = html.replace(/<script(?![^>]*type\s*=\s*["']application\/ld\+json["'])[^>]*\/>/gi, '');

  // Remove noscript tags
  html = html.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');

  // Remove Intercom elements
  html = html.replace(/<iframe[^>]*intercom[^>]*>[\s\S]*?<\/iframe>/gi, '');
  html = html.replace(/<div[^>]*id="intercom[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Remove Hotjar elements
  html = html.replace(/<iframe[^>]*hotjar[^>]*>[\s\S]*?<\/iframe>/gi, '');

  // Remove loading spinner / skeleton screens
  html = html.replace(/<div[^>]*id="loading"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Remove Datadog RUM
  html = html.replace(/<script[^>]*datadoghq[^>]*>[\s\S]*?<\/script>/gi, '');

  return html;
}

// ── Link Rewriting ─────────────────────────────────────────────────────

function buildLinkMap(pages) {
  const map = {};
  for (const p of pages) {
    map[p.path] = `${p.name}.html`;
    map[BASE_URL + p.path] = `${p.name}.html`;
    // Handle trailing slash variants
    if (!p.path.endsWith('/')) {
      map[p.path + '/'] = `${p.name}.html`;
      map[BASE_URL + p.path + '/'] = `${p.name}.html`;
    }
  }
  return map;
}

function rewriteLinks(html, linkMap) {
  for (const [orig, local] of Object.entries(linkMap)) {
    html = html.replaceAll(`href="${orig}"`, `href="${local}"`);
  }
  // Also rewrite any remaining absolute marketplace URLs to relative
  html = html.replaceAll(BASE_URL + '/', '');
  return html;
}

function injectLocalCSS(html, pageName) {
  const cssFile = pageName === 'index' ? 'extracted-styles.css' : `extracted-styles-${pageName}.css`;
  // Remove existing extracted-styles references
  html = html.replace(/<link[^>]*href="extracted-styles[^"]*\.css"[^>]*\/?>/gi, '');
  // Insert before </head>
  html = html.replace('</head>', `  <link rel="stylesheet" href="${cssFile}">\n</head>`);
  return html;
}

function injectInteractionsScript(html) {
  html = html.replace(/<script[^>]*src="[^"]*interactions\.js"[^>]*><\/script>/gi, '');
  html = html.replace('</body>', `  <script src="js/interactions.js"></script>\n</body>`);
  return html;
}

// ── API Interception ───────────────────────────────────────────────────

function setupAPIInterception(page) {
  page.on('response', async response => {
    const url = response.url();
    const status = response.status();

    // Only capture successful API calls
    if (status < 200 || status >= 300) return;

    // Capture REST API and GraphQL calls
    const isAPI = url.includes('/api/') || url.includes('/graphql') || url.includes('/rest/');
    if (!isAPI) return;

    try {
      const contentType = response.headers()['content-type'] || '';
      if (!contentType.includes('json')) return;

      const body = await response.text();
      const urlObj = new URL(url);
      const safeName = urlObj.pathname.replace(/^\//, '').replace(/\//g, '_');

      capturedAPIs.push({
        url: url,
        pathname: urlObj.pathname,
        method: response.request().method(),
        body: body,
        safeName: safeName,
      });
    } catch (e) {
      // Response body may not be available
    }
  });
}

// ── Main Scraper ───────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Transporeon Marketplace scraper...\n');
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Output: ${SITE_DIR}/`);
  console.log(`   Flags:  ${PAGES_ONLY ? '--pages-only' : ''} ${SKIP_ASSETS ? '--skip-assets' : ''}`);
  console.log('');

  ensureDir(SITE_DIR);
  ensureDir(JS_DIR);
  ensureDir(ASSETS_DIR);
  ensureDir(SCREENSHOTS_DIR);
  ensureDir(API_DATA_DIR);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...COOKIES);
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36');

  // Block analytics/tracking
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (
      url.includes('mixpanel') ||
      url.includes('inspectlet') ||
      url.includes('sentry') ||
      url.includes('intercom') ||
      url.includes('hotjar') ||
      url.includes('google-analytics') ||
      url.includes('googletagmanager') ||
      url.includes('datadoghq')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Set up API response interception
  setupAPIInterception(page);

  // ── Phase 1: Discover pages ────────────────────────────────────────

  const pages = await discoverPages(page);

  // Save discovered pages list
  fs.writeFileSync(
    path.join(SITE_DIR, 'discovered-pages.json'),
    JSON.stringify(pages, null, 2),
    'utf8'
  );

  if (PAGES_ONLY) {
    console.log('📋 Page discovery complete (--pages-only). Exiting.');
    await browser.close();
    return;
  }

  // ── Phase 2: Scrape each page ──────────────────────────────────────

  const linkMap = buildLinkMap(pages);
  const allAssetUrls = new Set();

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];
    const htmlFile = `${pageInfo.name}.html`;
    const cssFile = pageInfo.name === 'index' ? 'extracted-styles.css' : `extracted-styles-${pageInfo.name}.css`;

    console.log(`\n[${ i + 1}/${pages.length}] 📄 Scraping: ${pageInfo.name} (${pageInfo.path})`);

    try {
      // Navigate and wait for React render
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);

      // Check if we got redirected to login
      const currentUrl = page.url();
      if (currentUrl.includes('/login') || currentUrl.includes('/sign-in') || currentUrl.includes('/auth')) {
        console.log(`  ⚠️  Redirected to login — session may have expired. Skipping.`);
        continue;
      }

      // Take reference screenshot
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `${pageInfo.name}.png`),
        fullPage: true,
      });
      console.log(`  📸 Screenshot saved`);

      // Extract CSS
      const css = await extractAllCSS(page);
      fs.writeFileSync(path.join(SITE_DIR, cssFile), css, 'utf8');
      console.log(`  🎨 CSS extracted (${(css.length / 1024).toFixed(1)}KB)`);

      // Discover assets
      const assets = await discoverAssets(page);
      const assetCount = assets.css.length + assets.images.length + assets.svgSprites.length;
      console.log(`  🔍 Found: ${assets.css.length} CSS, ${assets.images.length} images, ${assets.svgSprites.length} SVG sprites`);

      // Collect asset URLs
      [...assets.css, ...assets.images, ...assets.svgSprites].forEach(u => {
        if (u && !u.startsWith('data:')) allAssetUrls.add(u);
      });

      // Extract font URLs from CSS
      const fontUrls = css.match(/url\(["']?([^"')]+\.(woff2?|ttf|eot|otf))["']?\)/gi) || [];
      fontUrls.forEach(match => {
        const url = match.replace(/url\(["']?/, '').replace(/["']?\)/, '');
        if (url && !url.startsWith('data:')) allAssetUrls.add(url);
      });

      // Detect dynamic content
      const dynamicInfo = await detectDynamicContent(page);
      const isDynamic = dynamicInfo.hasCanvas || dynamicInfo.hasCharts || dynamicInfo.hasDataTables || dynamicInfo.hasDataGrids || dynamicInfo.hasMaps;
      if (isDynamic) {
        dynamicPageReport.push({
          page: pageInfo.name,
          path: pageInfo.path,
          ...dynamicInfo,
        });
        console.log(`  ⚡ Dynamic content detected: ${JSON.stringify(dynamicInfo)}`);
      }

      // Get the rendered HTML
      let html = await page.content();

      // Clean and process
      html = cleanHTML(html);
      html = rewriteLinks(html, linkMap);
      html = injectLocalCSS(html, pageInfo.name);
      html = injectInteractionsScript(html);

      // Save HTML
      fs.writeFileSync(path.join(SITE_DIR, htmlFile), html, 'utf8');
      console.log(`  💾 HTML saved (${(html.length / 1024).toFixed(1)}KB)`);

    } catch (err) {
      console.error(`  ❌ Error scraping ${pageInfo.name}: ${err.message}`);
    }

    // Rate limiting — wait between pages
    if (i < pages.length - 1) {
      await sleep(2000);
    }
  }

  // ── Phase 3: Download assets ───────────────────────────────────────

  if (!SKIP_ASSETS) {
    console.log(`\n📥 Downloading ${allAssetUrls.size} discovered assets...`);

    for (const assetUrl of allAssetUrls) {
      try {
        let destPath;
        if (assetUrl.startsWith('/')) {
          destPath = path.join(SITE_DIR, assetUrl);
        } else if (assetUrl.startsWith('http')) {
          try {
            const urlObj = new URL(assetUrl);
            // Only download same-origin assets
            if (urlObj.hostname.includes('transporeon.com')) {
              destPath = path.join(SITE_DIR, urlObj.pathname);
            } else {
              continue; // Skip third-party assets
            }
          } catch { continue; }
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
  }

  // ── Phase 4: Save captured API data ────────────────────────────────

  if (capturedAPIs.length > 0) {
    console.log(`\n📡 Saving ${capturedAPIs.length} captured API responses...`);

    const seen = new Set();
    for (const api of capturedAPIs) {
      const key = `${api.method}_${api.safeName}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const filePath = path.join(API_DATA_DIR, `${api.safeName}.json`);
      ensureDir(path.dirname(filePath));

      try {
        // Pretty-print JSON if valid
        const parsed = JSON.parse(api.body);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`  📄 ${api.method} ${api.pathname} → ${api.safeName}.json`);
      } catch {
        fs.writeFileSync(filePath, api.body, 'utf8');
        console.log(`  📄 ${api.method} ${api.pathname} → ${api.safeName}.json (raw)`);
      }
    }
  }

  // ── Phase 5: Save dynamic pages report ─────────────────────────────

  if (dynamicPageReport.length > 0) {
    const reportPath = path.join(SITE_DIR, 'dynamic-pages-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(dynamicPageReport, null, 2), 'utf8');
    console.log(`\n⚡ Dynamic pages report: ${reportPath}`);
    console.log(`   ${dynamicPageReport.length} pages have dynamic content that may need custom components`);
  }

  await browser.close();

  // ── Summary ────────────────────────────────────────────────────────

  console.log('\n' + '═'.repeat(60));
  console.log('✅ Scraping complete!');
  console.log(`📁 Output: ${SITE_DIR}/`);
  console.log('');
  console.log('Pages scraped:');
  for (const p of pages) {
    const f = `${p.name}.html`;
    const fp = path.join(SITE_DIR, f);
    const size = fs.existsSync(fp) ? `${(fs.statSync(fp).size / 1024).toFixed(1)}KB` : 'MISSING';
    console.log(`  ${f.padEnd(45)} ${size}`);
  }

  if (dynamicPageReport.length > 0) {
    console.log('\n⚡ Pages with dynamic content:');
    for (const d of dynamicPageReport) {
      const parts = [];
      if (d.hasCanvas) parts.push(`${d.canvasCount} canvas`);
      if (d.hasCharts) parts.push(`${d.chartCount} charts`);
      if (d.hasDataTables) parts.push(`${d.tableRowCount} table rows`);
      if (d.hasDataGrids) parts.push('data grid');
      if (d.hasMaps) parts.push('map');
      console.log(`  ${d.page.padEnd(45)} ${parts.join(', ')}`);
    }
  }

  console.log('\nNext steps:');
  console.log('  npx serve site-marketplace              # Preview the replica');
  console.log('  # Review screenshots/ for visual comparison');
  if (dynamicPageReport.length > 0) {
    console.log('  # Review dynamic-pages-report.json for pages needing custom components');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
