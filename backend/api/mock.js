/**
 * Vercel Serverless Function — Mock API for Transporeon Insights demo
 *
 * Routes:
 *   GET  /api/v1/viewer
 *   GET  /api/v1/internal/company//subscriptions
 *   GET  /api/v1/crod//usage
 *   POST /api/graphql
 */
const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'api-data');

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(API_DIR, filePath), 'utf-8'));
  } catch (e) {
    return null;
  }
}

// Pre-load data at cold start
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

function handleGraphQL(body) {
  const { operationName, variables } = body;

  if (operationName === 'FilteredMetricFamiliesProperties') {
    return data['filter-properties'];
  }

  if (operationName === 'FilteredMetricFamiliesMetrics') {
    const ids = variables.metricFamilyIds || [];

    if (ids.includes('exchange-rate')) {
      return data['lane-overview-exchange-rate'];
    }

    if (ids.includes('spot-price') && ids.includes('contract-price') && ids.includes('diesel-price')) {
      return data['lane-overview-metrics'];
    }

    if (ids.includes('spot-price') && ids.length === 1) {
      const propertySets = variables.filter?.propertySets || [];
      if (propertySets.length === 2) {
        return data['lane-comparison-metrics'];
      }
      const startTime = variables.startTime || '';
      if (startTime.startsWith('2022')) {
        return data['yearly-comparison-metrics'];
      }
      return data['lane-comparison-metrics'];
    }
  }

  if (operationName === 'SpecificMetricFamilyMetricsWithMovers') {
    return data['top-movers'];
  }

  return { error: 'Unknown operation', operationName };
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const url = req.url.split('?')[0];

  // REST endpoints
  if (req.method === 'GET') {
    if (url.includes('/viewer')) {
      return res.json(data.viewer);
    }
    if (url.includes('/subscriptions')) {
      return res.json(data.subscriptions);
    }
    if (url.includes('/usage')) {
      return res.json(data['crod-usage']);
    }
  }

  // GraphQL endpoint
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = handleGraphQL(body);
      return res.json(result);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
};
