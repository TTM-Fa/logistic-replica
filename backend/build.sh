#!/usr/bin/env bash
set -euo pipefail

OUT="public"

echo "=== Cleaning output directory ==="
rm -rf "$OUT"
mkdir -p "$OUT"

# ─────────────────────────────────────────────────────
# 1. Insights + AQ (demo/dist) → root
# ─────────────────────────────────────────────────────
echo "=== Copying Insights + AQ (demo/dist) to root ==="
cp -r demo/dist/* "$OUT/"

# ─────────────────────────────────────────────────────
# 1b. Overlay site-insights extras (bundles + CSS)
#     demo/dist is missing most JS bundles & extracted-styles
# ─────────────────────────────────────────────────────
echo "=== Copying JS bundles from site-insights ==="
cp site-insights/js/* "$OUT/js/"

echo "=== Copying extracted-styles CSS from site-insights ==="
cp site-insights/extracted-styles-*.css "$OUT/"

echo "=== Overlaying site-insights HTML (has bundle refs + interactions) ==="
cp site-insights/*.html "$OUT/"

echo "=== Copying api-data (chart data JSONs) ==="
rm -rf "$OUT/api-data"
cp -r api-data "$OUT/api-data"

# ─────────────────────────────────────────────────────
# 1d. Inject chart-preload CSS into pages with bundles
#     Hides static scraped charts until React bundles mount
# ─────────────────────────────────────────────────────
PRELOAD_CSS='<style id="chart-preload">[data-testid="lane-rate-comparison-chart"],[data-testid="lanes-comparison"],[data-testid="yearly-comparison"],[data-testid="metric-upsell-notice"],[data-testid="spot-contract-comparison-chart"],[data-testid="metric-comparison-chart"],[data-testid="spot-vs-contract-table"],[data-testid="metric-overview-table"],[data-testid="spot-contract-overview-table"],.c1ocs50,._1p8blt30{visibility:hidden}</style>'
echo "=== Injecting chart-preload CSS into bundled pages ==="
for f in "$OUT"/road-lanes-lane-overview-standard.html \
         "$OUT"/road-lanes-lane-comparison-standard.html \
         "$OUT"/road-lanes-yearly-comparison-standard.html \
         "$OUT"/road-lanes-top-movers-standard.html \
         "$OUT"/road-rates.html \
         "$OUT"/road-rates-overview.html \
         "$OUT"/road-rates-spot-vs-contract.html \
         "$OUT"/road-capacity.html; do
  [ -f "$f" ] && sed -i "s#</head>#${PRELOAD_CSS}</head>#" "$f"
done

# ─────────────────────────────────────────────────────
# 1c. AQ pages → /aq/ subdirectory
#     site-aq/ has 29 fully-rendered HTML pages
#     (demo/dist SPA shells have JS hash mismatch, remove them)
# ─────────────────────────────────────────────────────
echo "=== Copying AQ pages to /aq/ ==="
rm -f "$OUT"/autonomous-quotation*.html
mkdir -p "$OUT/aq"
cp site-aq/*.html "$OUT/aq/"
rsync -a site-aq/aq-static/ "$OUT/aq-static/"

# ─────────────────────────────────────────────────────
# 2. Visibility (site/) → /visibility/
# ─────────────────────────────────────────────────────
echo "=== Copying Visibility (site/) to /visibility/ ==="
mkdir -p "$OUT/visibility"
# Copy everything except screenshots and READMEs
rsync -a --exclude='*.md' --exclude='screenshots/' site/ "$OUT/visibility/"

# Rewrite absolute paths in visibility HTML files
echo "  Rewriting asset paths in visibility HTML..."
find "$OUT/visibility" -name '*.html' -exec sed -i \
  -e 's#="/js/#="/visibility/js/#g' \
  -e 's#="/assets/#="/visibility/assets/#g' \
  {} +

# ─────────────────────────────────────────────────────
# 3. Marketplace (site-marketplace/) → /marketplace/
# ─────────────────────────────────────────────────────
echo "=== Copying Marketplace (site-marketplace/) to /marketplace/ ==="
mkdir -p "$OUT/marketplace"
# Copy everything except screenshots and discovery files
rsync -a \
  --exclude='screenshots/' \
  --exclude='discovered-pages.json' \
  --exclude='dynamic-pages-report.json' \
  site-marketplace/ "$OUT/marketplace/"

# Rewrite absolute paths in marketplace HTML files
# Marketplace uses root-level assets like /root.xxx.css, /logo_tp_white.xxx.svg
echo "  Rewriting asset paths in marketplace HTML..."
find "$OUT/marketplace" -name '*.html' -exec sed -i -E \
  -e 's# href="/([^"]*\.(css|js|svg|png|ico|woff|woff2|json))"# href="/marketplace/\1"#g' \
  -e 's# src="/([^"]*\.(css|js|svg|png|ico|woff|woff2))"# src="/marketplace/\1"#g' \
  {} +

# Rewrite root-level url() paths inside marketplace CSS files
# (icon fonts referenced as /modus-icons.xxx → /marketplace/modus-icons.xxx)
echo "  Rewriting CSS url() paths in marketplace CSS..."
for f in "$OUT"/marketplace/*.css; do
  sed -i -E 's#url\("?/([^)"]+\.(woff2?|ttf|eot|svg))"?\)#url("/marketplace/\1")#g' "$f"
done

# Inject Google Fonts link for Open Sans into marketplace HTML
echo "  Injecting Open Sans font into marketplace HTML..."
OPEN_SANS_LINK='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800\&display=swap" rel="stylesheet">'
for f in "$OUT"/marketplace/*.html; do
  sed -i "s#</head>#${OPEN_SANS_LINK}</head>#" "$f"
done

# ─────────────────────────────────────────────────────
# 3b. Remove all Transporeon branding from output
# ─────────────────────────────────────────────────────
echo "=== Removing Transporeon branding ==="
find "$OUT" -name '*.html' -exec sed -i \
  -e 's/Transporeon Insights/Market Insights/g' \
  -e 's/Transporeon Visibility/Visibility/g' \
  -e 's/Transporeon | Freight Marketplace/Freight Marketplace/g' \
  -e 's/Transporeon Freight Marketplace/Freight Marketplace/g' \
  -e 's/Transporeon Help Center/Help Center/g' \
  -e 's/Transporeon Web/Platform Web/g' \
  -e 's/Transporeon SSO/Platform SSO/g' \
  -e 's/Transporeon API/Platform API/g' \
  -e 's/Transporeon developer portal/Developer portal/g' \
  -e "s/Transporeon's platform/The platform/g" \
  -e 's/Transporeon platform/The platform/g' \
  -e 's/Transporeon via/the platform via/g' \
  -e 's/Transporeon provides/The platform provides/g' \
  -e 's/Transporeon offers/The platform offers/g' \
  -e 's/Transporeon exactly/the platform exactly/g' \
  -e 's/Transporeon will not/The platform will not/g' \
  -e 's/Transporeon assumes/The platform assumes/g' \
  -e 's/Transporeon to /the platform to /g' \
  -e 's/Transporeon has /The platform has /g' \
  -e 's/Transporeon login/platform login/g' \
  -e 's/Transporeon user account/platform user account/g' \
  -e 's/Transporeon accounts/platform accounts/g' \
  -e 's/[Tt]ransporeon\.com/platform.example.com/g' \
  -e 's/transporeon-hcskb\.atlassian\.net[^"]*/platform.example.com/g' \
  -e 's/Transporeon//g' \
  {} +

find "$OUT" -name '*.js' -exec sed -i \
  -e 's/Transporeon Insights/Market Insights/g' \
  -e 's/Transporeon Visibility/Visibility/g' \
  -e 's/Transporeon Help/Help/g' \
  -e 's/[Tt]ransporeon\.com/platform.example.com/g' \
  -e 's/Transporeon//g' \
  {} +

find "$OUT" \( -name '*.css' -o -name '*.json' \) -exec sed -i \
  -e 's/[Tt]ransporeon/platform/g' \
  {} +

# Handle files find misses (AQ vendor JS, filenames with special chars)
sed -i 's/transporeon/platform/g' "$OUT/aq-static/js/common-ui.Mgi1H_1g.js" 2>/dev/null || true
for f in "$OUT"/marketplace/tendering/css/min/*; do
  sed -i 's#Transporeon | Freight Marketplace#Freight Marketplace#g; s#[Tt]ransporeon#platform#g' "$f" 2>/dev/null || true
done

# ─────────────────────────────────────────────────────
# 3c. Replace logos with Shenateck branding
# ─────────────────────────────────────────────────────
echo "=== Replacing logos with Shenateck ==="
SHENATECK_ICON='<text x="12" y="18" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="currentColor" text-anchor="middle">S</text>'

# Insights sidebar logo: replace sprite #logomark-tp with inline Shenateck icon
echo "  Replacing Insights sidebar logo..."
find "$OUT" -maxdepth 1 -name '*.html' -exec sed -i \
  "s|<use href=\"/assets/images/sprite.c65451261fa5bb76c97c.svg#logomark-tp\"></use>|${SHENATECK_ICON}|g" {} +

# Visibility sidebar logo: replace sprite #logomark-6f with inline Shenateck icon
echo "  Replacing Visibility sidebar logo..."
find "$OUT/visibility" -name '*.html' -exec sed -i \
  "s|<use href=\"/visibility/js/sprite.c65451261fa5bb76c97c.svg#logomark-6f\"></use>|${SHENATECK_ICON}|g" {} +

# AQ sidebar logo: replace lightning bolt with Shenateck icon
echo "  Replacing AQ sidebar logo..."
find "$OUT/aq" -name '*.html' -exec sed -i \
  's|<rect width="24" height="24" rx="6" fill="#4f46e5"/><path d="M13.5 4L6 13h5l-1.5 7L17 11h-5l1.5-7z" fill="white" stroke="white" stroke-width="0.5" stroke-linejoin="round"/>|'"${SHENATECK_ICON}"'|g' {} +

# Visibility landing page: replace TRANSPOREON wordmark SVG with Shenateck
echo "  Replacing Visibility landing page wordmark..."
perl -i -0pe 's|<svg width="214" height="38" viewBox="0 0 214 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="ve7kmf2">.*?</svg>|<svg width="200" height="38" viewBox="0 0 200 38" class="ve7kmf2"><text x="0" y="28" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1a2b4a">Shenateck</text></svg>|s' "$OUT/visibility/index.html"

# ─────────────────────────────────────────────────────
# 4. Create hub landing page
# ─────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────
# 5. Copy login page
# ─────────────────────────────────────────────────────
echo "=== Copying login page ==="
cp login.html "$OUT/login.html"

# ─────────────────────────────────────────────────────
# 6. Create hub landing page (serves as index)
# ─────────────────────────────────────────────────────
echo "=== Creating landing page ==="
cat > "$OUT/index.html" << 'LANDING'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logistics Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
    }
    h1 {
      font-size: 2.2rem;
      color: #1a2b4a;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7a8d;
      font-size: 1.1rem;
      margin-bottom: 48px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1200px;
      width: 100%;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 4px solid;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .card h2 { font-size: 1.3rem; margin-bottom: 8px; }
    .card p { color: #6b7a8d; font-size: 0.95rem; line-height: 1.5; }
    .card .pages { color: #9aa5b4; font-size: 0.8rem; margin-top: 12px; }
    .insights { border-color: #0063a3; }
    .insights h2 { color: #0063a3; }
    .visibility { border-color: #2ecc71; }
    .visibility h2 { color: #2ecc71; }
    .marketplace { border-color: #e67e22; }
    .marketplace h2 { color: #e67e22; }
    .aq { border-color: #9b59b6; }
    .aq h2 { color: #9b59b6; }
  </style>
</head>
<body>
  <h1>Logistics Platform</h1>
  <div class="grid">
    <a href="/road-freight-perspectives.html" class="card insights">
      <h2>Market Insights</h2>
      <p>Rates, lanes, costs, capacity, and market analytics for road freight logistics.</p>
      <div class="pages">~40 pages &middot; Lane overview, comparison, top movers, rates, costs, market</div>
    </a>
    <a href="/visibility/index.html" class="card visibility">
      <h2>Visibility</h2>
      <p>Real-time fleet tracking, transport monitoring, dashboards, and analytics.</p>
      <div class="pages">9 pages &middot; Dashboards, fleet, transports, vehicle management</div>
    </a>
    <a href="/marketplace/index.html" class="card marketplace">
      <h2>Freight Marketplace</h2>
      <p>Spot procurement, RFQ tendering, lane requests, and carrier profiles.</p>
      <div class="pages">15 pages &middot; Spot, RFQ, lane requests, analysis, user mgmt</div>
    </a>
    <a href="/aq/index.html" class="card aq">
      <h2>Autonomous Quotation</h2>
      <p>AI-powered automated quoting, pricing strategies, and rule configuration.</p>
      <div class="pages">~25 pages &middot; Rules, live quotes, configuration, cost model</div>
    </a>
  </div>
</body>
</html>
LANDING

echo ""
echo "=== Build complete ==="
echo "Output: $OUT/"
echo ""
echo "Structure:"
echo "  /index.html              → Landing page (hub)"
echo "  /road-*.html, etc.       → Market Insights + AQ"
echo "  /visibility/             → Visibility"
echo "  /marketplace/            → Freight Marketplace"
echo "  /autonomous-quotation*   → Autonomous Quotation"
echo ""
echo "Deploy with: vercel --prod"
