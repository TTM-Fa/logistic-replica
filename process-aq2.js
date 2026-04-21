const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'site-aq');

// Complete route-to-file mapping
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
  '/configuration/cost-model': 'configuration-cost-model.html',
  '/configuration/email': 'configuration-email.html',
  '/configuration/pricing-strategies': 'configuration-pricing-strategies.html',
  '/configuration/quota': 'configuration-quota.html',
  '/configuration/reply-as-user': 'configuration-reply-as-user.html',
  '/configuration/reply-expiration-configuration': 'configuration-reply-expiration.html',
  '/welcome': 'welcome.html',
  '/help': 'help.html',
  '/help/knowledge-center': 'help-knowledge-center.html',
  '/help/knowledge-center/': 'help-knowledge-center.html',
  '/help/knowledge-center/advanced-ruleset': 'help-kc-advanced-ruleset.html',
  '/help/knowledge-center/completing-tasks': 'help-kc-completing-tasks.html',
  '/help/knowledge-center/creating-ruleset': 'help-kc-creating-ruleset.html',
  '/help/knowledge-center/editing-ruleset': 'help-kc-editing-ruleset.html',
  '/help/knowledge-center/external-price-api': 'help-kc-external-price-api.html',
  '/help/knowledge-center/getting-started': 'help-kc-getting-started.html',
  '/help/knowledge-center/integrations': 'help-kc-integrations.html',
  '/help/knowledge-center/optimizing-prices': 'help-kc-optimizing-prices.html',
  '/help/knowledge-center/sending-quotes': 'help-kc-sending-quotes.html',
  '/help/knowledge-center/setting-limits': 'help-kc-setting-limits.html',
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

  // 3. Remove modulepreload link tags
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

  // 4. Remove data consent dialog overlay (floating-ui-portal)
  html = html.replace(/<div id="_r_1s_" data-floating-ui-portal="">[\s\S]*?<\/div><\/div><\/div><\/div>(?=<\/body>)/, '');

  // 5. Remove data-floating-ui-inert and aria-hidden from root
  html = html.replace(/ data-floating-ui-inert=""/g, '');
  html = html.replace(/(<div id="root")[^>]*aria-hidden="true"/, '$1');

  // 6. Fix body overflow
  html = html.replace(/style="overflow: hidden;[^"]*"/, '');

  // 7. Convert navigation links - sort by longest path first to avoid partial matches
  const sortedRoutes = Object.entries(ROUTE_MAP).sort((a, b) => b[0].length - a[0].length);
  
  for (const [route, filename] of sortedRoutes) {
    // Exact match with optional query params
    const escaped = route.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
    
    // Match href="/route" exactly
    html = html.replace(new RegExp(`href="${escaped}"`, 'g'), `href="${filename}"`);
    
    // Match href="/route?anything" (query params)
    html = html.replace(new RegExp(`href="${escaped}\\?[^"]*"`, 'g'), `href="${filename}"`);
    
    // Match href="/route&amp;anything" (encoded params)
    html = html.replace(new RegExp(`href="${escaped}&amp;[^"]*"`, 'g'), `href="${filename}"`);
  }

  // 8. Fix help-center links with query params from index page
  html = html.replace(/href="\/\?help=[^"]*"/g, 'href="help-knowledge-center.html"');

  // 9. Fix any remaining /v1/reports links -> point to live-orders.html
  html = html.replace(/href="\/v1\/[^"]*"/g, 'href="live-orders.html"');

  // 10. Remove logout form action
  html = html.replace(/action="\/logout"/, 'action="#"');

  // 11. Remove login links
  html = html.replace(/href="\/login[^"]*"/g, 'href="#"');

  fs.writeFileSync(filePath, html);
  console.log(`  ${file}: ${origSize} -> ${html.length}`);
}

// Verify no broken links remain
console.log('\nChecking for remaining absolute paths...');
let allClean = true;
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const remaining = html.match(/href="\/[a-z][^"]*"/g);
  if (remaining) {
    const broken = [...new Set(remaining)].filter(l => !l.includes('/aq-static'));
    if (broken.length > 0) {
      console.log(`  ${file}: ${broken.join(', ')}`);
      allClean = false;
    }
  }
}
if (allClean) console.log('  All links clean!');

console.log('\nDone!');
