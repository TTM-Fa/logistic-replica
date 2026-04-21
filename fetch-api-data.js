const fs = require('fs');
const path = require('path');

const COOKIE = 'tpsso=ftplYU8pFxMvx96ZBLg28hXagq4nngjQ9k0fMbJRJ1NqOx46WFnAV1YAvvr3hbUh; tpsso_external=qbUQXsxDJx0M8IRpMre3JSVQxrIBiqCVK87ZFOOCFxO3pFM9Yx6WUbEoYaGjgZAz; LOCALE=en_US; sessionToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cGlfdXNlcl9lbWFpbCI6ImxvZ2lzdGljc0BzeW5kaWNhdGVncm91cC5jb20ucWEiLCJ0cGlfdXNlcmlkIjoiOTk2OTI1NiIsInRwaV9jdXN0b21lcmlkIjoiNjQ5MDQwIiwidHBpX2N1c3RvbWVyX25hbWUiOiJTeW5kaWNhdGUgTWFya2V0IiwidHBpX3VzZXJfZmlyc3RfbmFtZSI6IkFiZHVsYXppeiIsInRwaV91c2VyX2xhc3RfbmFtZSI6IkFsYWRiYSIsImlhdCI6MTc3NDUyMDY2MiwiZXhwIjoxNzc1NzMwMjYyfQ.6gN7YGP2EtNNiHrMZp1LqrjknY904Zj6E4HzpLB2Hyc';

const BASE = 'https://insights.transporeon.com';
const API_DIR = path.join(__dirname, 'api-data');

const headers = {
  'accept': 'application/json, text/plain, */*',
  'content-type': 'application/json',
  'cookie': COOKIE,
  'origin': BASE,
  'referer': `${BASE}/road/lanes/lane-overview/standard`,
};

// Shared REST endpoints (same across all tabs)
const restCalls = [
  { name: 'viewer', url: '/api/v1/viewer' },
  { name: 'subscriptions', url: '/api/v1/internal/company//subscriptions' },
  { name: 'crod-usage', url: '/api/v1/crod//usage' },
];

// Shared filter properties query (same for all Lanes sub-tabs)
const filterPropertiesBody = {
  operationName: 'FilteredMetricFamiliesProperties',
  variables: {
    metricFamilyIds: [
      'spot-price', 'spot-price-index', 'contract-price', 'contract-price-index',
      'spot-offers-index', 'contract-rejection-rate', 'diesel-price',
    ],
    filter: {},
  },
  extensions: {
    persistedQuery: { version: 1, sha256Hash: 'b6b4e9ed3d2d74c8ab4cd58c262f0583864ee080ed572e2780de14327fe8cb83' },
  },
};

// Per-tab GraphQL queries
const tabs = {
  'lane-overview': [
    {
      name: 'exchange-rate-check',
      body: {
        operationName: 'FilteredMetricFamiliesMetrics',
        variables: {
          metricFamilyIds: ['exchange-rate'],
          startTime: '2023-03-25T00:00:00.000Z',
          endTime: '2026-03-29T23:59:59.999Z',
          filter: { propertySets: [[{ name: 'exchange_currency', values: ['EUR'] }]] },
          frequency: 'WEEKLY',
          skipMetrics: true,
          hasUpdateTime: true,
          excludeProperties: [],
        },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: 'e6a17db6bb331835f8fad4ffb085c1e2ba38dcca3b03c7e20a60b07487826249' },
        },
      },
    },
    {
      name: 'metrics',
      body: {
        operationName: 'FilteredMetricFamiliesMetrics',
        variables: {
          metricFamilyIds: ['spot-price', 'contract-price', 'diesel-price'],
          startTime: '2024-03-25T00:00:00.000Z',
          endTime: '2026-03-29T23:59:59.999Z',
          filter: {
            propertySets: [[
              { name: 'lvl0_origin', values: ['Europe'] },
              { name: 'lvl0_destination', values: ['Europe'] },
              { name: 'origin_country', values: ['DE'] },
              { name: 'destination_country', values: ['DE'] },
              { name: 'lvl2_origin', values: ['ALL'] },
              { name: 'lvl2_destination', values: ['ALL'] },
              { name: 'equipment_type', values: ['standard'] },
            ]],
          },
          frequency: 'WEEKLY',
          skipMetrics: false,
          hasUpdateTime: true,
          excludeProperties: [{ name: 'is_forecasted', values: ['true'] }],
        },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: 'e6a17db6bb331835f8fad4ffb085c1e2ba38dcca3b03c7e20a60b07487826249' },
        },
      },
    },
  ],
  'lane-comparison': [
    {
      name: 'metrics',
      body: {
        operationName: 'FilteredMetricFamiliesMetrics',
        variables: {
          metricFamilyIds: ['spot-price'],
          startTime: '2024-03-25T00:00:00.000Z',
          endTime: '2026-03-29T23:59:59.999Z',
          filter: {
            propertySets: [
              [
                { name: 'lvl0_origin', values: ['Europe'] },
                { name: 'lvl0_destination', values: ['Europe'] },
                { name: 'origin_country', values: ['DE'] },
                { name: 'destination_country', values: ['DE'] },
                { name: 'lvl2_origin', values: ['Germany Central'] },
                { name: 'lvl2_destination', values: ['Germany East'] },
                { name: 'equipment_type', values: ['standard'] },
              ],
              [
                { name: 'lvl0_origin', values: ['Europe'] },
                { name: 'lvl0_destination', values: ['Europe'] },
                { name: 'origin_country', values: ['DE'] },
                { name: 'destination_country', values: ['DE'] },
                { name: 'lvl2_origin', values: ['Germany East'] },
                { name: 'lvl2_destination', values: ['Germany Central'] },
                { name: 'equipment_type', values: ['standard'] },
              ],
            ],
          },
          frequency: 'WEEKLY',
          skipMetrics: false,
          hasUpdateTime: true,
          excludeProperties: [{ name: 'is_forecasted', values: ['true'] }],
        },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: 'e6a17db6bb331835f8fad4ffb085c1e2ba38dcca3b03c7e20a60b07487826249' },
        },
      },
    },
  ],
  'yearly-comparison': [
    {
      name: 'metrics',
      body: {
        operationName: 'FilteredMetricFamiliesMetrics',
        variables: {
          metricFamilyIds: ['spot-price'],
          startTime: '2022-12-25T00:00:00.000Z',
          endTime: '2027-01-07T00:00:00.000Z',
          filter: {
            propertySets: [[
              { name: 'lvl0_origin', values: ['Europe'] },
              { name: 'lvl0_destination', values: ['Europe'] },
              { name: 'origin_country', values: ['DE'] },
              { name: 'destination_country', values: ['DE'] },
              { name: 'lvl2_origin', values: ['ALL'] },
              { name: 'lvl2_destination', values: ['ALL'] },
              { name: 'equipment_type', values: ['standard'] },
            ]],
          },
          frequency: 'WEEKLY',
          skipMetrics: false,
          hasUpdateTime: true,
          excludeProperties: [{ name: 'is_forecasted', values: ['true'] }],
        },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: 'e6a17db6bb331835f8fad4ffb085c1e2ba38dcca3b03c7e20a60b07487826249' },
        },
      },
    },
  ],
  'top-movers': [
    {
      name: 'movers',
      body: {
        operationName: 'SpecificMetricFamilyMetricsWithMovers',
        variables: {
          metricFamilyId: 'spot-price',
          startTime: '2024-03-18T00:00:00.000Z',
          endTime: '2026-03-22T23:59:59.999Z',
          frequency: 'WEEKLY',
          order: 'DESCENDING',
          count: 10,
          filter: {
            propertySets: [[
              { name: 'lvl2_origin', values: ['ALL'] },
              { name: 'lvl2_destination', values: ['ALL'] },
              { name: 'equipment_type', values: ['standard'] },
            ]],
          },
          sortBy: 'RELATIVE',
          offset: 0,
        },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: 'ccf3b9fe744597be342a88f91c6a0a2d4b05f00293d26fd5b44dc69e62f08587' },
        },
      },
    },
  ],
};

async function fetchGraphQL(name, body, outDir) {
  console.log(`  GraphQL: ${name}...`);
  try {
    const res = await fetch(`${BASE}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const filePath = path.join(outDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    const size = fs.statSync(filePath).size;
    console.log(`    ✓ ${name} (${res.status}, ${(size / 1024).toFixed(1)}KB)`);
  } catch (e) {
    console.error(`    ✗ ${name}: ${e.message}`);
  }
}

async function main() {
  // Save shared REST data
  const sharedDir = path.join(API_DIR, 'shared');
  fs.mkdirSync(sharedDir, { recursive: true });

  console.log('=== Shared REST APIs ===');
  for (const { name, url } of restCalls) {
    console.log(`  REST: ${name}...`);
    try {
      const res = await fetch(`${BASE}${url}`, { headers: { cookie: COOKIE, accept: 'application/json' } });
      const data = await res.json();
      fs.writeFileSync(path.join(sharedDir, `${name}.json`), JSON.stringify(data, null, 2));
      console.log(`    ✓ ${name} (${res.status})`);
    } catch (e) {
      console.error(`    ✗ ${name}: ${e.message}`);
    }
  }

  // Save shared filter properties
  console.log('\n=== Shared Filter Properties ===');
  await fetchGraphQL('filter-properties', filterPropertiesBody, sharedDir);

  // Save per-tab data
  for (const [tabName, queries] of Object.entries(tabs)) {
    const tabDir = path.join(API_DIR, tabName);
    fs.mkdirSync(tabDir, { recursive: true });
    console.log(`\n=== ${tabName} ===`);
    for (const { name, body } of queries) {
      await fetchGraphQL(name, body, tabDir);
    }
  }

  console.log('\nDone! Files saved to:', API_DIR);
  
  // Print summary
  const allFiles = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else allFiles.push({ path: full.replace(API_DIR + '/', ''), size: fs.statSync(full).size });
    }
  };
  walk(API_DIR);
  console.log('\nFiles:');
  for (const f of allFiles) {
    console.log(`  ${f.path} (${(f.size / 1024).toFixed(1)}KB)`);
  }
}

main();
