const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'site-aq');

// Map routes to local filenames
const ROUTE_MAP = {
  '/': 'index.html',
  '/rules': 'rules.html',
  '/live': 'live.html',
  '/live/quotes': 'live-quotes.html',
  '/live/revenue': 'live-revenue.html',
  '/live/laneways': 'live-laneways.html',
  '/live/orders': 'live-orders.html',
  '/live/rejected-orders': 'live-rejected-orders.html',
  '/configuration': 'configuration.html',
  '/welcome': 'welcome.html',
  '/help': 'help.html',
  '/help/knowledge-center': 'help-knowledge-center.html',
  '/help/privacy-notice': 'help-privacy-notice.html',
};

const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
console.log(`Processing ${htmlFiles.length} HTML files...`);

for (const file of htmlFiles) {
  const filePath = path.join(DIR, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  const origSize = html.length;

  // 1. Remove <script type="module"> tags that load JS bundles
  html = html.replace(/<script type="module"[^>]*src="\/aq-static\/js\/[^"]*"[^>]*><\/script>/g, '');

  // 2. Remove the window.__EMBED_DATA__ script
  html = html.replace(/<script>\s*window\.__EMBED_DATA__\s*=\s*\{[^}]*\}\s*<\/script>/g, '');

  // 3. Remove modulepreload link tags (not needed for static)
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

  // 4. Remove the data consent dialog overlay (the floating portal div)
  html = html.replace(/<div id="_r_1s_" data-floating-ui-portal="">[\s\S]*?<\/div><\/div><\/div><\/div>(?=<\/body>)/, '');

  // 5. Remove data-floating-ui-inert and aria-hidden from root div
  html = html.replace(/data-floating-ui-inert=""/g, '');
  html = html.replace(/<div id="root" [^>]*aria-hidden="true"/, '<div id="root"');

  // 6. Fix body overflow: hidden (caused by dialog)
  html = html.replace(/style="overflow: hidden;[^"]*"/, '');

  // 7. Convert navigation links to local filenames
  for (const [route, filename] of Object.entries(ROUTE_MAP)) {
    // Handle href="/route" 
    const escapedRoute = route.replace(/\//g, '\\/');
    
    // Match href="/route" exactly (with or without query params)
    // For routes with query params in the map, strip the params for matching
    const routeBase = route.split('?')[0];
    
    // Direct match: href="/rules" -> href="rules.html"
    html = html.replace(
      new RegExp(`href="${escapedRoute}"`, 'g'),
      `href="${filename}"`
    );
    
    // Match with query params: href="/live/quotes?..." -> href="live-quotes.html"
    if (!route.includes('?')) {
      html = html.replace(
        new RegExp(`href="${escapedRoute}\\?[^"]*"`, 'g'),
        `href="${filename}"`
      );
    }
  }

  // 8. Fix help-center links with query params
  html = html.replace(/href="\/\?help=[^"]*"/g, 'href="help-knowledge-center.html"');

  // 9. Remove logout form action (just make it do nothing)  
  html = html.replace(/action="\/logout"/, 'action="#"');

  // 10. Remove /login references
  html = html.replace(/href="\/login[^"]*"/g, 'href="#"');

  // 11. Fix the toaster div (keep it for potential interaction JS)
  // Already in the HTML, no changes needed

  fs.writeFileSync(filePath, html);
  console.log(`  ${file}: ${origSize} -> ${html.length} bytes`);
}

// Also check what we're missing - any broken links?
console.log('\nChecking for remaining absolute paths...');
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const remaining = html.match(/href="\/[a-z][^"]*"/g);
  if (remaining && remaining.length > 0) {
    const unique = [...new Set(remaining)];
    // Filter out /aq-static paths (those are fine)
    const broken = unique.filter(l => !l.includes('/aq-static'));
    if (broken.length > 0) {
      console.log(`  ${file}: ${broken.join(', ')}`);
    }
  }
}

console.log('\nDone!');
