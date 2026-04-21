const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Load the lane overview page
  await page.goto('http://localhost:3335/road-lanes-lane-overview-standard.html', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot: before clicking
  await page.screenshot({
    path: path.join(__dirname, 'interactions', 'test-before.png'),
    fullPage: false,
  });
  console.log('Before screenshot saved');

  // Check console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Find "Expand Market Overview submenu" button and click it
  const expandBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button[aria-expanded="false"]')];
    const btn = btns.find(b => b.textContent.includes('Market Overview'));
    if (btn) {
      const rect = btn.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, text: btn.textContent.trim().substring(0, 50) };
    }
    return null;
  });

  if (expandBtn) {
    console.log('Clicking:', expandBtn.text, 'at', expandBtn.x, expandBtn.y);
    await page.mouse.click(expandBtn.x, expandBtn.y);
    await new Promise(r => setTimeout(r, 1000));

    // Check if it expanded
    const afterState = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[aria-controls]')];
      return btns.map(b => ({
        text: b.textContent.trim().substring(0, 40),
        expanded: b.getAttribute('aria-expanded'),
      }));
    });
    console.log('After click states:', JSON.stringify(afterState, null, 2));
  } else {
    console.log('No expand button found — checking what buttons exist');
    const allBtns = await page.evaluate(() => {
      return [...document.querySelectorAll('button')].map(b => ({
        text: b.textContent.trim().substring(0, 50),
        ariaExpanded: b.getAttribute('aria-expanded'),
        ariaControls: b.getAttribute('aria-controls'),
      }));
    });
    console.log('All buttons:', JSON.stringify(allBtns, null, 2));
  }

  // Screenshot: after clicking
  await page.screenshot({
    path: path.join(__dirname, 'interactions', 'test-after.png'),
    fullPage: false,
  });
  console.log('After screenshot saved');

  await browser.close();
  console.log('Test complete!');
})();
