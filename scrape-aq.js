const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const COOKIE_STRING = `apt.uid=AP-IMFEHHOHPTJW-2-1774440003707-17717489.0.2.28a0690a-084a-453a-a29d-848970e0907c; _hjSessionUser_3213209=eyJpZCI6IjA3YTE5Y2JkLWYyZGQtNWIzZS04ODkxLWIwNDVmYjk1NzNhOSIsImNyZWF0ZWQiOjE3NzQ0NDAwMDM1NjgsImV4aXN0aW5nIjp0cnVlfQ==; __insp_uid=505532444; LOCALE=en_US; _hjSession_3213209=eyJpZCI6ImNhYzEyZWU0LTlmYWMtNDY1NC04NmJmLTEzMzc2MGY5ZTk3MCIsImMiOjE3NzU1NTE3OTM2MDUsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjEsImZzIjowLCJzcCI6MH0=; mp_d32aea635c956df8635890053bef59da_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%22680c3460-60fe-45c6-b2b0-28598a1c37ef%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; __insp_wid=690892928; __insp_nv=false; __insp_targlpu=aHR0cHM6Ly9hcS50cmFuc3BvcmVvbi5jb20vcnVsZXM%3D; __insp_targlpt=UnVsZSBtYW5hZ2VyIGRhc2hib2FyZCB8IEF1dG9ub21vdXMgUXVvdGF0aW9u; __insp_identity=OTk2OTI1Ng%3D%3D; __insp_sid=2886045005; _hjSessionUser_1928879=eyJpZCI6IjVjY2YwM2Y0LWM5MGItNWI1ZC04OWUyLTk4YjZlMTRiMzM1ZSIsImNyZWF0ZWQiOjE3NzQ0Mzk5NTg3NDksImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_1928879=eyJpZCI6IjZmOTI0YjliLWZmOTMtNDFhZC1hMDQwLTAwNmQwNTcwNDM0MyIsImMiOjE3NzU1NTQ4MDc1MTIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; aqSessionToken=eyJhbGciOiJIUzI1NiJ9.eyJ0cGlfdXNlcl9lbWFpbCI6ImxvZ2lzdGljc0BzeW5kaWNhdGVncm91cC5jb20ucWEiLCJ0cGlfdXNlcmlkIjoiOTk2OTI1NiIsInRwaV9jdXN0b21lcmlkIjoiNjQ5MDQwIiwidHBpX2N1c3RvbWVyX25hbWUiOiJTeW5kaWNhdGUgTWFya2V0IiwidHBpX3VzZXJfZmlyc3RfbmFtZSI6IkFiZHVsYXppeiIsInRwaV91c2VyX2xhc3RfbmFtZSI6IkFsYWRiYSIsImlhdCI6MTc3NTU1NDgzMiwiZXhwIjoxNzc2NzY0NDMyfQ.2DdagVvZv4al_7iIPDKiefO8E4cmQMRLuHcsdltoJUg; mp_247da6f10d9270bcc51145b8b0693fd4_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%222cad9ba8-4400-430a-ac66-bccb6a9b2943%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; __insp_pad=75; __insp_slim=1775556675255`;

const BASE_URL = 'https://aq.transporeon.com';
const OUT_DIR = path.join(__dirname, 'site-aq');

function parseCookies(cookieStr) {
  return cookieStr.split(';').map(c => {
    const [name, ...rest] = c.trim().split('=');
    return { name, value: rest.join('='), domain: 'aq.transporeon.com', path: '/' };
  });
}

async function fetchAsset(url, outPath) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'GET',
      headers: { cookie: COOKIE_STRING }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, buf);
        resolve(buf.length);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setCookie(...parseCookies(COOKIE_STRING));
  await page.setViewport({ width: 1920, height: 1080 });

  // Step 1: Visit homepage, discover navigation
  console.log('=== Step 1: Discovering routes ===');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  // Find all navigation links
  const navLinks = await page.evaluate(() => {
    const links = [];
    // Look for <a> tags with href containing aq.transporeon.com or relative paths
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (href && !href.startsWith('http') || (href && href.includes('aq.transporeon.com'))) {
        links.push({ href, text });
      }
    });
    // Also look for navigation elements (React routers often use divs/buttons)
    document.querySelectorAll('[role="tab"], [role="menuitem"], nav a, .nav-link, [data-testid*="nav"]').forEach(el => {
      links.push({ href: el.getAttribute('href') || el.getAttribute('data-href') || '', text: el.textContent.trim(), tag: el.tagName });
    });
    return links;
  });
  console.log('Navigation links found:', JSON.stringify(navLinks, null, 2));

  // Check for sidebar/menu items
  const menuItems = await page.evaluate(() => {
    const items = [];
    // Common patterns for SPA navigation
    document.querySelectorAll('aside a, .sidebar a, [class*="sidebar"] a, [class*="nav"] a, [class*="menu"] a, li a').forEach(el => {
      items.push({ href: el.getAttribute('href') || '', text: el.textContent.trim() });
    });
    return [...new Map(items.map(i => [i.href + i.text, i])).values()];
  });
  console.log('Menu items:', JSON.stringify(menuItems, null, 2));

  // Take a screenshot of the homepage
  await page.screenshot({ path: path.join(OUT_DIR, 'screenshot-home.png'), fullPage: true });
  console.log('Screenshot saved');

  // Get the full HTML
  const homeHtml = await page.content();
  console.log('Home HTML size:', homeHtml.length);

  // Try known routes
  const knownRoutes = ['/', '/rules', '/dashboard', '/quotations', '/settings', '/analytics', '/reports', '/history'];

  // First discover all reachable routes from the page
  const allHrefs = await page.evaluate(() => {
    const hrefs = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (h && h.startsWith('/')) hrefs.add(h);
    });
    // Check for React Router paths in the JS
    const scripts = document.querySelectorAll('script');
    scripts.forEach(s => {
      const text = s.textContent || '';
      const matches = text.match(/path:\s*["']([^"']+)["']/g);
      if (matches) matches.forEach(m => {
        const p = m.match(/["']([^"']+)["']/);
        if (p) hrefs.add(p[1]);
      });
    });
    return [...hrefs];
  });
  console.log('All hrefs from page:', allHrefs);

  // Build the route list
  const routes = new Set(['/']);
  allHrefs.forEach(h => routes.add(h));
  knownRoutes.forEach(r => routes.add(r));

  console.log('\n=== Step 2: Scraping each route ===');
  const results = {};

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`\nVisiting: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));

      const title = await page.title();
      const finalUrl = page.url();
      const html = await page.content();
      const filename = route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '-');

      // Check if we got redirected to login
      if (finalUrl.includes('login') || finalUrl.includes('saml')) {
        console.log(`  -> Redirected to login: ${finalUrl}`);
        continue;
      }

      // Check if page has actual content (not just empty root)
      const hasContent = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML.length : 0;
      });

      console.log(`  Title: ${title}`);
      console.log(`  Final URL: ${finalUrl}`);
      console.log(`  HTML size: ${html.length}`);
      console.log(`  Root content size: ${hasContent}`);

      if (hasContent > 100) {
        fs.writeFileSync(path.join(OUT_DIR, `${filename}.html`), html);
        await page.screenshot({ path: path.join(OUT_DIR, `screenshot-${filename}.png`), fullPage: true });
        results[route] = { title, filename, htmlSize: html.length, contentSize: hasContent };
        console.log(`  -> Saved ${filename}.html`);
      } else {
        console.log(`  -> Skipped (no content)`);
      }
    } catch (e) {
      console.log(`  -> Error: ${e.message}`);
    }
  }

  console.log('\n=== Step 3: Downloading static assets ===');

  // Download CSS files
  const cssFiles = [
    '/aq-static/assets/common-ui-DQJxj-56.css',
    '/aq-static/assets/routes-5G3gTN9i.css',
    '/aq-static/assets/loading_indicator-Bao4s3mg.css',
    '/aq-static/assets/analytics-S2exsWi8.css',
    '/aq-static/assets/page_header-BZ902MZg.css',
    '/aq-static/assets/formatted_number-CE2RFN-6.css',
    '/aq-static/assets/code-Bgd1x3qA.css',
    '/aq-static/assets/main-BYpH2Ski.css'
  ];

  for (const cssPath of cssFiles) {
    try {
      const outPath = path.join(OUT_DIR, cssPath);
      const size = await fetchAsset(`${BASE_URL}${cssPath}`, outPath);
      console.log(`Downloaded ${cssPath} (${size} bytes)`);
    } catch (e) {
      console.log(`Failed to download ${cssPath}: ${e.message}`);
    }
  }

  // Download favicon
  const favicons = [
    '/aq-static/favicon/apple-touch-icon.png',
    '/aq-static/favicon/favicon-32x32.png',
    '/aq-static/favicon/favicon-16x16.png',
    '/aq-static/favicon/favicon.ico',
    '/aq-static/favicon/safari-pinned-tab.svg',
    '/aq-static/favicon/site.webmanifest'
  ];

  for (const fav of favicons) {
    try {
      const outPath = path.join(OUT_DIR, fav);
      const size = await fetchAsset(`${BASE_URL}${fav}`, outPath);
      console.log(`Downloaded ${fav} (${size} bytes)`);
    } catch (e) {
      console.log(`Failed ${fav}: ${e.message}`);
    }
  }

  // Download the main JS bundle
  try {
    const jsPath = '/aq-static/js/main.BN0cJKsl.js';
    const outPath = path.join(OUT_DIR, jsPath);
    const size = await fetchAsset(`${BASE_URL}${jsPath}`, outPath);
    console.log(`Downloaded main JS (${size} bytes)`);
  } catch (e) {
    console.log(`Failed to download main JS: ${e.message}`);
  }

  console.log('\n=== Results Summary ===');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
