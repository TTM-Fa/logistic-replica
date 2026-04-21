/**
 * mock-api.js — Lightweight mock API server for Transporeon Insights demo
 * 
 * Serves captured API responses from api-data/ directory.
 * Start: node mock-api.js
 * Runs alongside `npx serve site-insights` (static file server)
 * 
 * Endpoints:
 *   GET  /api/v1/viewer                        → shared/viewer.json
 *   GET  /api/v1/internal/company//subscriptions → shared/subscriptions.json
 *   GET  /api/v1/crod//usage                    → shared/crod-usage.json
 *   POST /graphql                               → matches operationName to saved data
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const API_DIR = path.join(__dirname, 'api-data');

// Load all JSON files into memory
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(API_DIR, filePath), 'utf-8'));
  } catch (e) {
    console.error(`Failed to load ${filePath}: ${e.message}`);
    return null;
  }
}

const data = {
  viewer: loadJSON('shared/viewer.json'),
  subscriptions: loadJSON('shared/subscriptions.json'),
  'crod-usage': loadJSON('shared/crod-usage.json'),
  'filter-properties': loadJSON('shared/filter-properties.json'),
  'lane-overview-metrics': loadJSON('lane-overview/metrics.json'),
  'lane-overview-exchange-rate': loadJSON('lane-overview/exchange-rate-check.json'),
  'lane-comparison-metrics': loadJSON('lane-comparison/metrics.json'),
  'yearly-comparison-metrics': loadJSON('yearly-comparison/metrics.json'),
  'top-movers': loadJSON('top-movers/movers.json'),
};

// Route GraphQL requests by operationName + variables
function handleGraphQL(body) {
  const { operationName, variables } = body;

  if (operationName === 'FilteredMetricFamiliesProperties') {
    return data['filter-properties'];
  }

  if (operationName === 'FilteredMetricFamiliesMetrics') {
    const ids = variables.metricFamilyIds || [];

    // Exchange rate check
    if (ids.includes('exchange-rate')) {
      return data['lane-overview-exchange-rate'];
    }

    // Lane overview: spot-price + contract-price + diesel-price
    if (ids.includes('spot-price') && ids.includes('contract-price') && ids.includes('diesel-price')) {
      return data['lane-overview-metrics'];
    }

    // Lane comparison or yearly: just spot-price
    if (ids.includes('spot-price') && ids.length === 1) {
      const propertySets = variables.filter?.propertySets || [];
      // Lane comparison has 2 property sets, yearly has 1
      if (propertySets.length === 2) {
        return data['lane-comparison-metrics'];
      }
      // Yearly comparison has longer time range
      const startTime = variables.startTime || '';
      if (startTime.startsWith('2022')) {
        return data['yearly-comparison-metrics'];
      }
      // Default: return lane-comparison
      return data['lane-comparison-metrics'];
    }
  }

  if (operationName === 'SpecificMetricFamilyMetricsWithMovers') {
    return data['top-movers'];
  }

  return { error: 'Unknown operation', operationName };
}

const server = http.createServer((req, res) => {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // REST endpoints
  if (req.method === 'GET') {
    if (url === '/api/v1/viewer') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.viewer));
      return;
    }
    if (url === '/api/v1/internal/company//subscriptions') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.subscriptions));
      return;
    }
    if (url === '/api/v1/crod//usage') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data['crod-usage']));
      return;
    }
  }

  // GraphQL endpoint
  if (req.method === 'POST' && url === '/graphql') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const result = handleGraphQL(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /api/v1/viewer');
  console.log('  GET  /api/v1/internal/company//subscriptions');
  console.log('  GET  /api/v1/crod//usage');
  console.log('  POST /graphql');
  console.log(`\nServing data from: ${API_DIR}`);
});
