const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  const cookies = [
    { name: 'tpsso', value: '2s1bZTRu3fgsFQbVKUicLkeDxhrCDzOZbqRRXWGQrz6zsbyC6Rgkys6Wh1L2vQnL', domain: '.transporeon.com', path: '/' },
    { name: 'tpsso_external', value: 'cBdmYR8879QQUSjD3XS3zSlcNMrxgfaGUmv3Y8POOJbo8aNv01IxZNWY1h3VKh5f', domain: '.transporeon.com', path: '/' },
    { name: 'LOCALE', value: 'en_US', domain: '.transporeon.com', path: '/' }
  ];
  await page.setCookie(...cookies);
  
  // Go to home first to trigger SSO
  console.log('Step 1: Navigating to home...');
  await page.goto('https://marketplace.transporeon.com/home', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('URL after home:', page.url());
  
  // Click Sign In for SSO  
  const signIn = await page.evaluate(() => {
    const els = [...document.querySelectorAll('button, a')];
    const btn = els.find(e => e.textContent.trim().includes('Sign In'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log('Clicked Sign In:', signIn);
  
  if (signIn) {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
    console.log('After SSO redirect:', page.url());
    // Wait for the app to fully load
    await new Promise(r => setTimeout(r, 5000));
    console.log('After wait:', page.url());
  }
  
  // Navigate to Spot page
  console.log('\nStep 2: Going to Spot...');
  await page.goto('https://marketplace.transporeon.com/spot/spotShipment', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 7000));
  console.log('Spot URL:', page.url());
  
  await page.screenshot({ path: 'site-marketplace/screenshots/explore-spot-page.png', fullPage: false });
  
  // Check what's on the page
  const pageInfo = await page.evaluate(() => {
    const items = document.querySelectorAll('.spotfinderListItem');
    const cards = document.querySelectorAll('.spotFinderListItemCard');
    const bodyText = document.body.innerText.substring(0, 800);
    return {
      rowCount: items.length,
      cardCount: cards.length,
      bodyText
    };
  });
  console.log('Rows:', pageInfo.rowCount, 'Cards:', pageInfo.cardCount);
  console.log('Page text preview:\n', pageInfo.bodyText);
  
  if (pageInfo.rowCount > 0) {
    // Click the first row to see what happens
    console.log('\nStep 3: Clicking first shipment row...');
    await page.click('.spotfinderListItem');
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('URL after click:', page.url());
    await page.screenshot({ path: 'site-marketplace/screenshots/explore-spot-detail.png', fullPage: false });
    
    // Extract detail view HTML if we navigated
    const detailInfo = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const drawers = document.querySelectorAll('.MuiDrawer-root');
      const modals = document.querySelectorAll('.MuiModal-root');
      const visibleDrawers = [...drawers].filter(d => {
        const paper = d.querySelector('.MuiDrawer-paper');
        return paper && !paper.style.visibility?.includes('hidden') && !paper.style.transform?.includes('translateX(401px)');
      });
      
      return {
        url: window.location.href,
        dialogCount: dialogs.length,
        modalCount: modals.length,
        drawerCount: drawers.length,
        visibleDrawerCount: visibleDrawers.length,
        bodyText: document.body.innerText.substring(0, 1000)
      };
    });
    console.log('Detail info:', JSON.stringify(detailInfo, null, 2));
    
    // If we navigated to a detail page, get the full HTML structure
    if (detailInfo.url !== 'https://marketplace.transporeon.com/spot/spotShipment') {
      console.log('\nStep 4: Extracting detail page structure...');
      const detailHTML = await page.evaluate(() => {
        // Get the main content area
        const root = document.getElementById('root');
        return root ? root.innerHTML.substring(0, 5000) : 'no root';
      });
      
      // Save the full detail page
      const fs = require('fs');
      const html = await page.content();
      fs.writeFileSync('site-marketplace/spot-detail-raw.html', html);
      console.log('Detail page saved. Size:', html.length);
      
      // Extract CSS
      const css = await page.evaluate(() => {
        let allCSS = '';
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              allCSS += rule.cssText + '\n';
            }
          } catch(e) {}
        }
        return allCSS;
      });
      fs.writeFileSync('site-marketplace/extracted-styles-spot-detail.css', css);
      console.log('Detail CSS saved. Size:', css.length);
    }
    
    // Also extract data from the detail view for creating our own detail component
    const detailData = await page.evaluate(() => {
      // Look for shipment detail data
      const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => h.textContent.trim());
      const labels = [...document.querySelectorAll('p, span, div')].filter(e => e.children.length === 0).map(e => e.textContent.trim()).filter(t => t.length > 0 && t.length < 100).slice(0, 60);
      return { headings, labels };
    });
    console.log('\nDetail headings:', detailData.headings.slice(0, 20));
    console.log('Detail labels:', detailData.labels.slice(0, 40));
  }
  
  await browser.close();
  console.log('\nDone!');
})().catch(console.error);
