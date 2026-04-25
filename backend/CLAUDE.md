# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A static replica of the **Transporeon Insights** logistics analytics platform (`insights.transporeon.com`), scraped with Puppeteer/Playwright for demo purposes. The replica runs entirely offline, with a mock API server serving captured API responses.

Two sites were scraped:
- **Transporeon Visibility** (`app.sixfold.com`) → `site/`
- **Transporeon Insights** (`insights.transporeon.com`) → `site-insights/`

## Running the Replica

Start both servers in separate terminals:

```bash
# Static file server (site-insights demo)
npx serve site-insights

# Mock API server (serves captured API responses on port 3001)
node mock-api.js
```

## Architecture

### Data Flow
1. `site-insights/` contains scraped HTML + per-page CSS (`extracted-styles-{page}.css`)
2. `api-data/` contains captured API responses (JSON) organized by tab:
   - `api-data/shared/` — viewer, subscriptions, crod-usage, filter-properties
   - `api-data/lane-overview/`, `lane-comparison/`, `yearly-comparison/`, `top-movers/`
3. `mock-api.js` serves those JSON files on `:3001`, routing by GraphQL `operationName` + `variables`
4. Interactions JS (`site-insights/js/interactions.js`) was injected into all HTML files via `inject-interactions.js`

### Scraping Scripts (one-time use, require live session cookies)
- `fetch-api-data.js` — fetches GraphQL + REST API responses for the Lanes sub-tabs
- `discover-interactions.js` — uses Puppeteer to discover all clickable interactions on each page
- `test-interactions.js` — tests discovered interactions
- `fix-lane-links.js` — fixes reefer/contact-support links in Lanes sub-tab pages

### Key Files
- `mock-api.js` — mock API server; routes by `operationName` in GraphQL body
- `inject-interactions.js` — injects `interactions.js` script tag into all HTML files in `site-insights/`
- `interactions/interaction-catalog.json` — catalog of all discovered interactions per page
- `SCRAPING-GUIDE.md` — full documentation of the scraping process for both sites

### GraphQL Routing Logic (mock-api.js)
The mock server disambiguates GraphQL queries by `operationName` + `variables.metricFamilyIds`:
- `exchange-rate` → lane-overview exchange rate data
- `spot-price + contract-price + diesel-price` → lane-overview metrics
- `spot-price` with 2 propertySets → lane-comparison metrics
- `spot-price` with startTime starting `2022` → yearly-comparison metrics
- `SpecificMetricFamilyMetricsWithMovers` → top-movers data
