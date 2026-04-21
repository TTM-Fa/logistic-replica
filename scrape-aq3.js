const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIE_STRING = fs.readFileSync('scrape-aq2.js', 'utf-8').match(/const COOKIE_STRING = `([^]+?)`;/)[1];
const BASE_URL = 'https://aq.transporeon.com';
const OUT_DIR = path.join(__dirname, 'site-aq');
const delay = ms => new Promise(r => setTimeout(r, ms));

function parseCookies(cookieStr) {
  return cookieStr.split(';').map(c => {
    const [name, ...rest] = c.trim().split('=');
    return { name, value: rest.join('='), domain: 'aq.transporeon.com', path: '/' };
  });
}

const EXTRA_ROUTES = [
  // Configuration sub-pages
  { path: '/configuration/cost-model', name: 'configuration-cost-model' },
  { path: '/configuration/email', name: 'configuration-email' },
  { path: '/configuration/pricing-strategies', name: 'configuration-pricing-strategies' },
  { path: '/configuration/quota', name: 'configuration-quota' },
  { path: '/configuration/reply-as-user', name: 'configuration-reply-as-user' },
  { path: '/configuration/reply-expiration-configuration', name: 'configuration-reply-expiration' },
  // Knowledge center articles
  { path: '/help/knowledge-center/advanced-ruleset', name: 'help-kc-advanced-ruleset' },
  { path: '/help/knowledge-center/completing-tasks', name: 'help-kc-completing-tasks' },
  { path: '/help/knowledge-center/creating-ruleset', name: 'help-kc-creating-ruleset' },
  { path: '/help/knowledge-center/editing-ruleset', name: 'help-kc-editing-ruleset' },
  { path: '/help/knowledge-center/external-price-api', name: 'help-kc-external-price-api' },
  { path: '/help/knowledge-center/getting-started', name: 'help-kc-getting-started' },
  { path: '/help/knowledge-center/integrations', name: 'help-kc-integrations' },
  { path: '/help/knowledge-center/optimizing-prices', name: 'help-kc-optimizing-prices' },
  { path: '/help/knowledge-center/sending-quotes', name: 'help-kc-sending-quotes' },
  { path: '/help/knowledge-center/setting-limits', name: 'help-kc-setting-limits' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const route of EXTRA_ROUTES) {
    const htmlPath = path.join(OUT_DIR, `${route.name}.html`);
    if (fs.existsSync(htmlPath)) {
      console.log(`Skip ${route.name} (exists)`);
      continue;
    }

    console.log(`Scraping: ${route.path} -> ${route.name}`);
    const page = await browser.newPage();
    await page.setCookie(...parseCookies(COOKIE_STRING));
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await delay(5000);

      // Wait for content
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

      if (finalUrl.includes('/login') || finalUrl.includes('/saml')) {
        console.log(`  -> Login redirect`);
        await page.close();
        continue;
      }

      const rootSize = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML.length : 0;
      });

      console.log(`  ${title} | ${html.length}B, root: ${rootSize}B`);
      fs.writeFileSync(htmlPath, html);
      await page.screenshot({ path: path.join(OUT_DIR, `screenshot-${route.name}.png`), fullPage: true });
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done!');
})();
