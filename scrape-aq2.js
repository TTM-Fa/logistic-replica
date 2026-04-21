const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const COOKIE_STRING = `apt.uid=AP-IMFEHHOHPTJW-2-1774440003707-17717489.0.2.28a0690a-084a-453a-a29d-848970e0907c; _hjSessionUser_3213209=eyJpZCI6IjA3YTE5Y2JkLWYyZGQtNWIzZS04ODkxLWIwNDVmYjk1NzNhOSIsImNyZWF0ZWQiOjE3NzQ0NDAwMDM1NjgsImV4aXN0aW5nIjp0cnVlfQ==; __insp_uid=505532444; LOCALE=en_US; _hjSession_3213209=eyJpZCI6ImNhYzEyZWU0LTlmYWMtNDY1NC04NmJmLTEzMzc2MGY5ZTk3MCIsImMiOjE3NzU1NTE3OTM2MDUsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjEsImZzIjowLCJzcCI6MH0=; mp_d32aea635c956df8635890053bef59da_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%22680c3460-60fe-45c6-b2b0-28598a1c37ef%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; __insp_wid=690892928; __insp_nv=false; __insp_targlpu=aHR0cHM6Ly9hcS50cmFuc3BvcmVvbi5jb20vcnVsZXM%3D; __insp_targlpt=UnVsZSBtYW5hZ2VyIGRhc2hib2FyZCB8IEF1dG9ub21vdXMgUXVvdGF0aW9u; __insp_identity=OTk2OTI1Ng%3D%3D; __insp_sid=2886045005; _hjSessionUser_1928879=eyJpZCI6IjVjY2YwM2Y0LWM5MGItNWI1ZC04OWUyLTk4YjZlMTRiMzM1ZSIsImNyZWF0ZWQiOjE3NzQ0Mzk5NTg3NDksImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_1928879=eyJpZCI6IjZmOTI0YjliLWZmOTMtNDFhZC1hMDQwLTAwNmQwNTcwNDM0MyIsImMiOjE3NzU1NTQ4MDc1MTIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; aqSessionToken=eyJhbGciOiJIUzI1NiJ9.eyJ0cGlfdXNlcl9lbWFpbCI6ImxvZ2lzdGljc0BzeW5kaWNhdGVncm91cC5jb20ucWEiLCJ0cGlfdXNlcmlkIjoiOTk2OTI1NiIsInRwaV9jdXN0b21lcmlkIjoiNjQ5MDQwIiwidHBpX2N1c3RvbWVyX25hbWUiOiJTeW5kaWNhdGUgTWFya2V0IiwidHBpX3VzZXJfZmlyc3RfbmFtZSI6IkFiZHVsYXppeiIsInRwaV91c2VyX2xhc3RfbmFtZSI6IkFsYWRiYSIsImlhdCI6MTc3NTU1NDgzMiwiZXhwIjoxNzc2NzY0NDMyfQ.2DdagVvZv4al_7iIPDKiefO8E4cmQMRLuHcsdltoJUg; mp_247da6f10d9270bcc51145b8b0693fd4_mixpanel=%7B%22distinct_id%22%3A%229969256%22%2C%22%24device_id%22%3A%222cad9ba8-4400-430a-ac66-bccb6a9b2943%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%229969256%22%7D; __insp_pad=75; __insp_slim=1775556675255`;

const BASE_URL = 'https://aq.transporeon.com';
const OUT_DIR = path.join(__dirname, 'site-aq');
const delay = ms => new Promise(r => setTimeout(r, ms));

function parseCookies(cookieStr) {
  return cookieStr.split(';').map(c => {
    const [name, ...rest] = c.trim().split('=');
    return { name, value: rest.join('='), domain: 'aq.transporeon.com', path: '/' };
  });
}

function fetchAsset(url, outPath) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: { cookie: COOKIE_STRING }
    }, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchAsset(res.headers.location, outPath).then(resolve).catch(reject);
        return;
      }
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

// Routes to scrape (discovered from step 1)
const ROUTES = [
  { path: '/live', name: 'live' },
  { path: '/live/quotes?created_at_end=tomorrow&created_at_start=6daysago', name: 'live-quotes' },
  { path: '/live/revenue?created_at_end=tomorrow&created_at_start=6daysago', name: 'live-revenue' },
  { path: '/live/laneways?created_at_end=tomorrow&created_at_start=6daysago', name: 'live-laneways' },
  { path: '/live/orders?created_at_end=tomorrow&created_at_start=6daysago', name: 'live-orders' },
  { path: '/live/rejected-orders?created_at_end=tomorrow&created_at_start=6daysago', name: 'live-rejected-orders' },
  { path: '/configuration', name: 'configuration' },
  { path: '/welcome', name: 'welcome' },
  { path: '/help', name: 'help' },
  { path: '/help/knowledge-center', name: 'help-knowledge-center' },
  { path: '/help/privacy-notice', name: 'help-privacy-notice' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  for (const route of ROUTES) {
    const htmlPath = path.join(OUT_DIR, `${route.name}.html`);
    if (fs.existsSync(htmlPath)) {
      console.log(`Skipping ${route.name} (already exists)`);
      continue;
    }

    console.log(`\nScraping: ${route.path} -> ${route.name}`);
    const page = await browser.newPage();
    await page.setCookie(...parseCookies(COOKIE_STRING));
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // Use domcontentloaded + wait, since networkidle2 may hang on streaming connections
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait for React to render
      await delay(5000);

      // Additional wait: check that #root has content
      let retries = 0;
      while (retries < 10) {
        const rootSize = await page.evaluate(() => {
          const root = document.getElementById('root');
          return root ? root.innerHTML.length : 0;
        });
        if (rootSize > 500) break;
        await delay(1000);
        retries++;
      }

      const title = await page.title();
      const finalUrl = page.url();
      const html = await page.content();

      // Check for login redirect
      if (finalUrl.includes('/login') || finalUrl.includes('/saml')) {
        console.log(`  -> Redirected to login: ${finalUrl}`);
        await page.close();
        continue;
      }

      const rootSize = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML.length : 0;
      });

      console.log(`  Title: ${title}`);
      console.log(`  Final URL: ${finalUrl}`);
      console.log(`  HTML: ${html.length} bytes, Root: ${rootSize} bytes`);

      fs.writeFileSync(htmlPath, html);
      await page.screenshot({ path: path.join(OUT_DIR, `screenshot-${route.name}.png`), fullPage: true });
      results[route.name] = { title, htmlSize: html.length, rootSize };
      console.log(`  -> Saved ${route.name}.html + screenshot`);
    } catch (e) {
      console.log(`  -> Error: ${e.message}`);
    }
    await page.close();
  }

  // Download static assets
  console.log('\n=== Downloading static assets ===');

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
    const outPath = path.join(OUT_DIR, cssPath);
    if (fs.existsSync(outPath)) { console.log(`  Skip ${cssPath}`); continue; }
    try {
      const size = await fetchAsset(`${BASE_URL}${cssPath}`, outPath);
      console.log(`  ${cssPath} (${size} bytes)`);
    } catch (e) {
      console.log(`  FAIL ${cssPath}: ${e.message}`);
    }
  }

  const favicons = [
    '/aq-static/favicon/apple-touch-icon.png',
    '/aq-static/favicon/favicon-32x32.png',
    '/aq-static/favicon/favicon-16x16.png',
    '/aq-static/favicon/favicon.ico',
    '/aq-static/favicon/safari-pinned-tab.svg',
    '/aq-static/favicon/site.webmanifest'
  ];
  for (const fav of favicons) {
    const outPath = path.join(OUT_DIR, fav);
    if (fs.existsSync(outPath)) { console.log(`  Skip ${fav}`); continue; }
    try {
      const size = await fetchAsset(`${BASE_URL}${fav}`, outPath);
      console.log(`  ${fav} (${size} bytes)`);
    } catch (e) {
      console.log(`  FAIL ${fav}: ${e.message}`);
    }
  }

  // Download main JS
  const jsPath = '/aq-static/js/main.BN0cJKsl.js';
  const jsOutPath = path.join(OUT_DIR, jsPath);
  if (!fs.existsSync(jsOutPath)) {
    try {
      const size = await fetchAsset(`${BASE_URL}${jsPath}`, jsOutPath);
      console.log(`  Main JS (${size} bytes)`);
    } catch (e) {
      console.log(`  FAIL main JS: ${e.message}`);
    }
  }

  // Also find and download additional JS chunks from the rendered pages
  console.log('\n=== Looking for additional JS/CSS chunks ===');
  const existingHtmlFiles = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.html'));
  const assetUrls = new Set();
  for (const htmlFile of existingHtmlFiles) {
    const html = fs.readFileSync(path.join(OUT_DIR, htmlFile), 'utf-8');
    const matches = html.matchAll(/\/aq-static\/[^"'\s)]+/g);
    for (const m of matches) {
      assetUrls.add(m[0]);
    }
  }
  console.log(`Found ${assetUrls.size} unique asset URLs`);
  for (const assetUrl of assetUrls) {
    const outPath = path.join(OUT_DIR, assetUrl);
    if (fs.existsSync(outPath)) continue;
    try {
      const size = await fetchAsset(`${BASE_URL}${assetUrl}`, outPath);
      console.log(`  ${assetUrl} (${size} bytes)`);
    } catch (e) {
      console.log(`  FAIL ${assetUrl}: ${e.message}`);
    }
  }

  console.log('\n=== Summary ===');
  console.log(JSON.stringify(results, null, 2));

  // List all files
  const allFiles = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else allFiles.push({ path: full.replace(OUT_DIR + '/', ''), size: fs.statSync(full).size });
    }
  }
  walk(OUT_DIR);
  console.log('\nAll files:');
  allFiles.forEach(f => console.log(`  ${f.path} (${(f.size/1024).toFixed(1)}KB)`));

  await browser.close();
  console.log('\nDone!');
})();
