# Transporeon - Scraping Guide

## Prerequisites

```bash
npm install puppeteer
```

## Overview

Two sites were scraped, both under the Transporeon umbrella:

1. **Transporeon Visibility** (`app.sixfold.com`) — logistics tracking platform → `site/`
2. **Transporeon Insights** (`insights.transporeon.com`) — market analytics platform → `site-insights/`

Each uses the same Puppeteer-based approach for scraping SPAs.

---

# Site 1: Transporeon Visibility (`site/`)

Three scripts were used in sequence.

---

## Step 1: Scrape Landing Page + All Assets

**Script: `scrape-all.js`**

This script:
- Opens the landing page with Puppeteer using session cookies
- Waits for the SPA to fully render
- Downloads all CSS files, images, SVG sprites, fonts, and favicon
- Extracts all computed CSS rules from the rendered page
- Cleans the HTML (removes third-party scripts: Intercom, Inspectlet, Sentry, Mixpanel)
- Saves `index.html` + `extracted-styles.css` + a reference screenshot

```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const URL_TARGET = 'https://app.sixfold.com/companies/321090/landing-page';
const BASE = 'https://app.sixfold.com';
const OUT = '/home/taha/Projects/logistic-replica/site';

const cookieString = "sixfold_tracking_consent=ok; sixfold_last_login={\"type\":\"transporeon\"}; sixfold_lng=en; sessionToken=YOUR_SESSION_TOKEN_HERE";
const cookies = cookieString.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: '.sixfold.com', path: '/' };
});

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'Cookie': cookieString } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...cookies);

  console.log('Navigating...');
  await page.goto(URL_TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));

  // Collect all resource URLs from the page
  const resources = await page.evaluate(() => {
    const urls = new Set();
    // CSS files
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => urls.add(el.href));
    // Images
    document.querySelectorAll('img').forEach(el => { if (el.src) urls.add(el.src); });
    // SVG sprite references
    document.querySelectorAll('use').forEach(el => {
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');
      if (href) {
        const svgUrl = href.split('#')[0];
        if (svgUrl) urls.add(new URL(svgUrl, location.origin).href);
      }
    });
    // Favicon
    document.querySelectorAll('link[rel="icon"]').forEach(el => urls.add(el.href));
    return [...urls];
  });

  console.log(`Found ${resources.length} resources to download`);

  // Download all resources
  for (const url of resources) {
    try {
      const urlObj = new URL(url);
      const localPath = path.join(OUT, urlObj.pathname);
      console.log(`Downloading: ${urlObj.pathname}`);
      await downloadFile(url, localPath);
    } catch (e) {
      console.error(`Failed: ${url} - ${e.message}`);
    }
  }

  // Extract all computed CSS rules
  const allCSS = await page.evaluate(() => {
    const styles = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) styles.push(rule.cssText);
      } catch (e) {}
    }
    return styles.join('\n');
  });
  fs.writeFileSync(path.join(OUT, 'extracted-styles.css'), allCSS);
  console.log(`Extracted ${allCSS.length} chars of CSS`);

  // Download fonts referenced in CSS
  const fontUrls = allCSS.match(/url\(["']?(https?:\/\/[^"')]+|\/[^"')]+)["']?\)/g) || [];
  for (const match of fontUrls) {
    const url = match.replace(/url\(["']?/, '').replace(/["']?\)/, '');
    try {
      const fullUrl = url.startsWith('http') ? url : BASE + url;
      const urlObj = new URL(fullUrl);
      const localPath = path.join(OUT, urlObj.pathname);
      if (!fs.existsSync(localPath)) {
        console.log(`Downloading font/asset: ${urlObj.pathname}`);
        await downloadFile(fullUrl, localPath);
      }
    } catch (e) {}
  }

  // Get rendered HTML and clean it
  let html = await page.content();
  html = html.replace(/<script[^>]*(intercom|inspectlet|sentry|mixpanel)[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*(intercom|inspectlet|sentry|mixpanel)[^>]*\/>/gi, '');
  html = html.replace(/<script[^>]*src="\/js\/(runtime|vendor|main|6f-vendor)[^"]*"[^>]*><\/script>/gi, '');
  html = html.replace(/<script>[\s\S]*?__EMBED_DATA__[\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', `<link rel="stylesheet" href="extracted-styles.css">\n</head>`);
  html = html.replace(/<iframe[^>]*intercom[^>]*>[\s\S]*?<\/iframe>/gi, '');
  html = html.replace(/<div[^>]*intercom[^>]*>[\s\S]*?<\/div>/gi, '');

  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log('Saved index.html');

  await page.screenshot({ path: path.join(OUT, 'reference.png'), fullPage: true });
  console.log('Screenshot saved');

  await browser.close();
  console.log('Done!');
})();
```

**Run:**
```bash
node scrape-all.js
```

---

## Step 2: Scrape All Sidebar Pages

**Script: `scrape-pages.js`**

This script:
- Navigates to each sidebar page using the same session
- Downloads any new CSS/images not already present
- Extracts page-specific CSS rules
- Saves each page as `{name}.html` with its own `extracted-styles-{name}.css`
- Takes a screenshot of each page for reference

```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://app.sixfold.com';
const OUT = '/home/taha/Projects/logistic-replica/site';

const pages = [
  { name: 'dashboards', path: '/companies/321090/dashboards' },
  { name: 'transports', path: '/companies/321090/transports' },
  { name: 'data-network', path: '/companies/321090/data-network' },
  { name: 'analytics', path: '/companies/321090/analytics' },
  { name: 'vehicle-management', path: '/companies/321090/vehicle-management' },
  { name: 'fleet', path: '/companies/321090/fleet' },
  { name: 'notifications', path: '/companies/321090/notifications' },
  { name: 'shared-views', path: '/companies/321090/shared-views' },
];

const cookieString = "sixfold_tracking_consent=ok; sixfold_last_login={\"type\":\"transporeon\"}; sixfold_lng=en; sessionToken=YOUR_SESSION_TOKEN_HERE";
const cookies = cookieString.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: '.sixfold.com', path: '/' };
});

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, { headers: { 'Cookie': cookieString } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...cookies);

  for (const pg of pages) {
    const url = BASE + pg.path;
    console.log(`\n=== Scraping: ${pg.name} (${url}) ===`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 5000));

      // Screenshot
      await page.screenshot({
        path: path.join(OUT, `${pg.name}-screenshot.png`),
        fullPage: true,
      });

      // Download new images
      const newImages = await page.evaluate(() => {
        const urls = new Set();
        document.querySelectorAll('img').forEach(el => { if (el.src) urls.add(el.src); });
        document.querySelectorAll('[style*="background"]').forEach(el => {
          const match = el.style.cssText.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) urls.add(new URL(match[1], location.origin).href);
        });
        return [...urls];
      });

      for (const imgUrl of newImages) {
        try {
          const urlObj = new URL(imgUrl);
          const localPath = path.join(OUT, urlObj.pathname);
          if (!fs.existsSync(localPath)) {
            console.log(`  Downloading new asset: ${urlObj.pathname}`);
            await downloadFile(imgUrl, localPath);
          }
        } catch (e) {}
      }

      // Download new CSS files
      const newCSS = await page.evaluate(() => {
        const urls = [];
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => urls.push(el.href));
        return urls;
      });

      for (const cssUrl of newCSS) {
        try {
          const urlObj = new URL(cssUrl);
          const localPath = path.join(OUT, urlObj.pathname);
          if (!fs.existsSync(localPath)) {
            console.log(`  Downloading new CSS: ${urlObj.pathname}`);
            await downloadFile(cssUrl, localPath);
          }
        } catch (e) {}
      }

      // Extract all CSS rules
      const allCSS = await page.evaluate(() => {
        const styles = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) styles.push(rule.cssText);
          } catch (e) {}
        }
        return styles.join('\n');
      });

      // Get rendered HTML and clean it
      let html = await page.content();
      html = html.replace(/<script[^>]*(intercom|inspectlet|sentry|mixpanel)[^>]*>[\s\S]*?<\/script>/gi, '');
      html = html.replace(/<script[^>]*(intercom|inspectlet|sentry|mixpanel)[^>]*\/>/gi, '');
      html = html.replace(/<script[^>]*src="\/js\/(runtime|vendor|main|6f-vendor)[^"]*"[^>]*><\/script>/gi, '');
      html = html.replace(/<script>[\s\S]*?__EMBED_DATA__[\s\S]*?<\/script>/gi, '');
      html = html.replace(/<iframe[^>]*intercom[^>]*>[\s\S]*?<\/iframe>/gi, '');
      html = html.replace('</head>', `<link rel="stylesheet" href="extracted-styles-${pg.name}.css">\n</head>`);

      fs.writeFileSync(path.join(OUT, `extracted-styles-${pg.name}.css`), allCSS);
      fs.writeFileSync(path.join(OUT, `${pg.name}.html`), html);
      console.log(`  HTML saved (${html.length} chars), CSS saved (${allCSS.length} chars)`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nAll pages scraped!');
})();
```

**Run:**
```bash
node scrape-pages.js
```

---

## Step 3: Fix Navigation Links

**Script: `fix-links.js`**

This script rewrites all `href` attributes in every HTML file so sidebar navigation works locally between the scraped pages.

```js
const fs = require('fs');
const path = require('path');

const OUT = '/home/taha/Projects/logistic-replica/site';

const linkMap = {
  '/companies/321090/landing-page': 'index.html',
  '/companies/321090/dashboards': 'dashboards.html',
  '/companies/321090/transports': 'transports.html',
  '/companies/321090/data-network': 'data-network.html',
  '/companies/321090/analytics': 'analytics.html',
  '/companies/321090/vehicle-management': 'vehicle-management.html',
  '/companies/321090/fleet': 'fleet.html',
  '/companies/321090/notifications': 'notifications.html',
  '/companies/321090/shared-views': 'shared-views.html',
};

const htmlFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.html') && !f.includes('screenshot'));

for (const file of htmlFiles) {
  const filePath = path.join(OUT, file);
  let html = fs.readFileSync(filePath, 'utf8');

  for (const [origPath, localFile] of Object.entries(linkMap)) {
    html = html.replace(new RegExp(`href="${origPath}"`, 'g'), `href="${localFile}"`);
    html = html.replace(new RegExp(`href="${origPath}/"`, 'g'), `href="${localFile}"`);
  }

  fs.writeFileSync(filePath, html);
  console.log(`Fixed links in ${file}`);
}

console.log('Done!');
```

**Run:**
```bash
node fix-links.js
```

---

## How to Serve

```bash
npx serve site
```

## Output Structure

```
site/
├── index.html                          # Landing page
├── dashboards.html                     # Dashboards
├── transports.html                     # Road transports
├── data-network.html                   # Visibility Control Center
├── analytics.html                      # Analytics
├── vehicle-management.html             # Vehicle management
├── fleet.html                          # Fleet monitor
├── notifications.html                  # Notification rules
├── shared-views.html                   # Shared views
├── extracted-styles.css                # Landing page CSS
├── extracted-styles-{page}.css         # Per-page CSS
├── js/                                 # CSS bundles, fonts, SVG sprite, favicon
│   ├── *.css
│   ├── *.woff2 / *.woff (Silka + Inter fonts)
│   ├── sprite.*.svg
│   └── *.ico
├── assets/
│   ├── landing_page_map.png
│   ├── *.svg
│   └── logos/*.png                     # Company logos
└── *-screenshot.png                    # Reference screenshots
```

## Key Technique

Since Transporeon Visibility is a **Single Page Application** (React), the raw HTML is just an empty shell. The approach:

1. **Puppeteer** renders the page with real session cookies
2. After the SPA hydrates, we capture the **fully rendered DOM**
3. We extract **all CSS rules** (including dynamically loaded ones) via `document.styleSheets`
4. We download all **static assets** (fonts, images, SVGs) from the server
5. We **strip third-party scripts** (analytics, chat widgets) that aren't needed
6. We **rewrite navigation links** to point between local HTML files

This gives a pixel-perfect static replica that works entirely offline.

---

# Site 2: Transporeon Insights (`site-insights/`)

One script handles everything: landing page, auto-discovers all nav links, scrapes every page, downloads assets, and fixes links.

## Step 1: Scrape All Pages + Assets

**Script: `scrape-insights.js`**

This script:
- Opens the Freight Perspectives page with Puppeteer using session cookies
- Downloads all CSS, images, fonts, and SVGs
- Auto-discovers all internal navigation links (`<a href="/...">`)
- Iterates through every discovered page, scraping each one
- Cleans HTML (removes Hotjar, Mixpanel, Sentry, Google Analytics)
- Saves each page as `{name}.html` with `extracted-styles-{name}.css`

```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const URL_TARGET = 'https://insights.transporeon.com/road/freight-perspectives';
const BASE = 'https://insights.transporeon.com';
const OUT = '/home/taha/Projects/logistic-replica/site-insights';

const cookieString = 'tpsso=YOUR_TPSSO_TOKEN; tpsso_external=YOUR_TPSSO_EXTERNAL; LOCALE=en_US; sessionToken=YOUR_JWT_TOKEN';

const cookies = cookieString.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: '.transporeon.com', path: '/' };
});

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'Cookie': cookieString } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...cookies);

  console.log('Navigating to', URL_TARGET);
  await page.goto(URL_TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));

  // Screenshot
  await page.screenshot({ path: path.join(OUT, 'screenshot.png'), fullPage: true });

  // Collect all resource URLs
  const resources = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => urls.add(el.href));
    document.querySelectorAll('img').forEach(el => { if (el.src) urls.add(el.src); });
    document.querySelectorAll('use').forEach(el => {
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');
      if (href) {
        const svgUrl = href.split('#')[0];
        if (svgUrl) urls.add(new URL(svgUrl, location.origin).href);
      }
    });
    document.querySelectorAll('link[rel="icon"]').forEach(el => urls.add(el.href));
    document.querySelectorAll('[style*="background"]').forEach(el => {
      const match = el.style.cssText.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) urls.add(new URL(match[1], location.origin).href);
    });
    return [...urls];
  });

  console.log(`Found ${resources.length} resources to download`);

  for (const url of resources) {
    try {
      const urlObj = new URL(url);
      const localPath = path.join(OUT, urlObj.pathname);
      if (!fs.existsSync(localPath)) {
        console.log(`Downloading: ${urlObj.pathname}`);
        await downloadFile(url, localPath);
      }
    } catch (e) {
      console.error(`Failed: ${url} - ${e.message}`);
    }
  }

  // Extract all CSS rules
  const allCSS = await page.evaluate(() => {
    const styles = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) styles.push(rule.cssText);
      } catch (e) {}
    }
    return styles.join('\n');
  });
  fs.writeFileSync(path.join(OUT, 'extracted-styles.css'), allCSS);
  console.log(`Extracted ${allCSS.length} chars of CSS`);

  // Download fonts from CSS
  const fontUrls = allCSS.match(/url\(["']?(https?:\/\/[^"')]+|\/[^"')]+)["']?\)/g) || [];
  for (const match of fontUrls) {
    const url = match.replace(/url\(["']?/, '').replace(/["']?\)/, '');
    try {
      const fullUrl = url.startsWith('http') ? url : BASE + url;
      const urlObj = new URL(fullUrl);
      const localPath = path.join(OUT, urlObj.pathname);
      if (!fs.existsSync(localPath)) {
        console.log(`Downloading font/asset: ${urlObj.pathname}`);
        await downloadFile(fullUrl, localPath);
      }
    } catch (e) {}
  }

  // Auto-discover all internal nav links
  const navLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        links.push({ href, text: a.textContent.trim().substring(0, 50) });
      }
    });
    const seen = new Set();
    return links.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  });
  console.log(`\nFound ${navLinks.length} navigation links`);

  // Save landing page HTML
  let html = await page.content();
  html = html.replace(/<script[^>]*(hotjar|mixpanel|sentry|analytics|gtag|google)[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*src="\/js\/(runtime|vendor|main|chunk)[^"]*"[^>]*><\/script>/gi, '');
  html = html.replace('</head>', `<link rel="stylesheet" href="extracted-styles.css">\n</head>`);
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log('Saved index.html');

  // Scrape each discovered page
  const pagesToScrape = navLinks.filter(l =>
    l.href !== '/' &&
    l.href.length > 1 &&
    !l.href.includes('#') &&
    !l.href.includes('mailto') &&
    !l.href.includes('login')
  );

  for (const pg of pagesToScrape) {
    const url = BASE + pg.href;
    const name = pg.href.replace(/^\//, '').replace(/\//g, '-') || 'home';
    console.log(`\n=== Scraping: ${name} (${url}) ===`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 5000));

      await page.screenshot({
        path: path.join(OUT, `${name}-screenshot.png`),
        fullPage: true,
      });

      // Download new assets
      const newAssets = await page.evaluate(() => {
        const urls = new Set();
        document.querySelectorAll('img').forEach(el => { if (el.src) urls.add(el.src); });
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => urls.add(el.href));
        document.querySelectorAll('[style*="background"]').forEach(el => {
          const match = el.style.cssText.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) urls.add(new URL(match[1], location.origin).href);
        });
        return [...urls];
      });

      for (const assetUrl of newAssets) {
        try {
          const urlObj = new URL(assetUrl);
          const localPath = path.join(OUT, urlObj.pathname);
          if (!fs.existsSync(localPath)) {
            console.log(`  Downloading: ${urlObj.pathname}`);
            await downloadFile(assetUrl, localPath);
          }
        } catch (e) {}
      }

      // Page CSS
      const pageCSS = await page.evaluate(() => {
        const styles = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) styles.push(rule.cssText);
          } catch (e) {}
        }
        return styles.join('\n');
      });

      // Page HTML
      let pageHtml = await page.content();
      pageHtml = pageHtml.replace(/<script[^>]*(hotjar|mixpanel|sentry|analytics|gtag|google)[^>]*>[\s\S]*?<\/script>/gi, '');
      pageHtml = pageHtml.replace('</head>', `<link rel="stylesheet" href="extracted-styles-${name}.css">\n</head>`);

      fs.writeFileSync(path.join(OUT, `extracted-styles-${name}.css`), pageCSS);
      fs.writeFileSync(path.join(OUT, `${name}.html`), pageHtml);
      console.log(`  Saved ${name}.html (${pageHtml.length} chars)`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nDone!');
})();
```

**Run:**
```bash
node scrape-insights.js
```

## Step 2: Fix Navigation Links

**Script: `fix-insights-links.js`**

This script auto-discovers all internal hrefs across all HTML files, maps them to local filenames, and rewrites the links.

```js
const fs = require('fs');
const path = require('path');

const OUT = '/home/taha/Projects/logistic-replica/site-insights';

const htmlFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.html'));

// Scan all HTML files to find internal hrefs
const allHrefs = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(OUT, file), 'utf8');
  const matches = content.match(/href="(\/[^"]*?)"/g) || [];
  for (const m of matches) {
    const href = m.replace('href="', '').replace('"', '');
    if (href.startsWith('/') && !href.startsWith('//')) {
      allHrefs.add(href);
    }
  }
}

// Build map: original path -> local file
const linkMap = {};
linkMap['/road/freight-perspectives'] = 'index.html';

for (const href of allHrefs) {
  const name = href.replace(/^\//, '').replace(/\//g, '-') || 'home';
  const localFile = name + '.html';
  if (fs.existsSync(path.join(OUT, localFile))) {
    linkMap[href] = localFile;
  }
}

console.log(`Built link map with ${Object.keys(linkMap).length} entries`);

// Apply replacements
for (const file of htmlFiles) {
  const filePath = path.join(OUT, file);
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [origPath, localFile] of Object.entries(linkMap)) {
    html = html.split(`href="${origPath}"`).join(`href="${localFile}"`);
  }
  fs.writeFileSync(filePath, html);
}

console.log(`Fixed links in ${htmlFiles.length} files`);
console.log('Done!');
```

**Run:**
```bash
node fix-insights-links.js
```

## Output Structure

```
site-insights/
├── index.html                              # Freight Perspectives (landing)
├── road-market-overview.html               # Market Overview
├── road-market-demand.html                 # Market Demand
├── road-lanes.html                         # Lanes
├── road-lanes-lane-overview-standard.html  # Lane Overview
├── road-lanes-lane-comparison-standard.html
├── road-lanes-top-movers-standard.html
├── road-lanes-yearly-comparison-standard.html
├── road-rates.html                         # Rates
├── road-rates-overview.html
├── road-rates-forecast.html
├── road-rates-spot-vs-contract.html
├── road-capacity.html                      # Capacity
├── road-costs.html                         # Costs
├── road-costs-diesel-price.html
├── road-costs-lane.html
├── road-costs-market.html
├── road-rate-on-demand.html                # Rate on Demand
├── road-rate-on-demand-spot.html
├── road-rate-on-demand-contract.html
├── road-dashboards.html                    # Dashboards
├── road-subscriptions.html                 # Subscriptions
├── settings.html                           # Settings
├── autonomous-quotation*.html              # Autonomous Quotation pages
├── road-help*.html                         # Help pages
├── extracted-styles*.css                   # Per-page CSS
├── assets/                                 # Images
├── aq-static/                              # Quotation assets
├── ajax/                                   # API data
└── api/                                    # API data
```

## How to Serve

```bash
npx serve site-insights
```

## Key Difference from Site 1

The Insights scraper **auto-discovers pages** by scanning all `<a href="/...">` links on the landing page, rather than hardcoding a page list. This makes it reusable — if new pages are added to the nav, they'll be picked up automatically.
