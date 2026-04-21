const fs = require('fs');
const path = require('path');

const COOKIE = 'tpsso=ftplYU8pFxMvx96ZBLg28hXagq4nngjQ9k0fMbJRJ1NqOx46WFnAV1YAvvr3hbUh; tpsso_external=qbUQXsxDJx0M8IRpMre3JSVQxrIBiqCVK87ZFOOCFxO3pFM9Yx6WUbEoYaGjgZAz; LOCALE=en_US; sessionToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cGlfdXNlcl9lbWFpbCI6ImxvZ2lzdGljc0BzeW5kaWNhdGVncm91cC5jb20ucWEiLCJ0cGlfdXNlcmlkIjoiOTk2OTI1NiIsInRwaV9jdXN0b21lcmlkIjoiNjQ5MDQwIiwidHBpX2N1c3RvbWVyX25hbWUiOiJTeW5kaWNhdGUgTWFya2V0IiwidHBpX3VzZXJfZmlyc3RfbmFtZSI6IkFiZHVsYXppeiIsInRwaV91c2VyX2xhc3RfbmFtZSI6IkFsYWRiYSIsImlhdCI6MTc3NDUyMDY2MiwiZXhwIjoxNzc1NzMwMjYyfQ.6gN7YGP2EtNNiHrMZp1LqrjknY904Zj6E4HzpLB2Hyc';

const BASE = 'https://insights.transporeon.com';
const OUT_DIR = path.join(__dirname, 'demo', 'public', 'api-data');

const headers = {
  'accept': 'application/json, text/plain, */*',
  'content-type': 'application/json',
  'cookie': COOKIE,
  'origin': BASE,
};

// Countries to fetch data for (most relevant European routes)
const COUNTRIES = ['DE', 'FR', 'NL', 'BE', 'PL', 'ES', 'IT', 'GB', 'AT', 'CZ'];

// German regions for sub-region data
const DE_REGIONS = ['ALL', 'Germany Central', 'Germany East', 'Germany Northeast', 'Germany Northwest', 'Germany Southeast', 'Germany Southwest', 'Germany West'];

function makeMetricsQuery(originCountry, destCountry, originRegion = 'ALL', destRegion = 'ALL') {
  return {
    operationName: 'FilteredMetricFamiliesMetrics',
    variables: {
      metricFamilyIds: ['spot-price', 'contract-price', 'diesel-price'],
      startTime: '2024-03-25T00:00:00.000Z',
      endTime: '2026-04-02T23:59:59.999Z',
      filter: {
        propertySets: [[
          { name: 'lvl0_origin', values: ['Europe'] },
          { name: 'lvl0_destination', values: ['Europe'] },
          { name: 'origin_country', values: [originCountry] },
          { name: 'destination_country', values: [destCountry] },
          { name: 'lvl2_origin', values: [originRegion] },
          { name: 'lvl2_destination', values: [destRegion] },
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
  };
}

async function fetchGraphQL(body) {
  const res = await fetch(`${BASE}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

async function main() {
  const laneOverviewDir = path.join(OUT_DIR, 'lane-overview');
  fs.mkdirSync(laneOverviewDir, { recursive: true });
  
  const allData = {};
  
  console.log('Fetching lane data for country combinations...\n');
  
  // Fetch for all country-to-country combinations (same country)
  for (const country of COUNTRIES) {
    const key = `${country}-${country}`;
    console.log(`Fetching ${key}...`);
    try {
      const data = await fetchGraphQL(makeMetricsQuery(country, country));
      if (data.data?.viewer?.metricFamilies?.length > 0) {
        allData[key] = data.data.viewer;
        console.log(`  ✓ ${key} - ${data.data.viewer.metricFamilies.length} metric families`);
      } else {
        console.log(`  ⚠ ${key} - no data`);
      }
    } catch (e) {
      console.log(`  ✗ ${key} - ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200)); // Rate limiting
  }
  
  // Fetch some cross-country routes
  const crossRoutes = [
    ['DE', 'FR'], ['DE', 'NL'], ['DE', 'PL'], ['DE', 'AT'], ['DE', 'CZ'],
    ['FR', 'DE'], ['NL', 'DE'], ['PL', 'DE'], ['FR', 'ES'], ['IT', 'DE'],
    ['GB', 'DE'], ['BE', 'DE'], ['DE', 'BE'], ['NL', 'BE'], ['BE', 'FR'],
  ];
  
  for (const [origin, dest] of crossRoutes) {
    const key = `${origin}-${dest}`;
    if (allData[key]) continue; // Skip if already fetched
    console.log(`Fetching ${key}...`);
    try {
      const data = await fetchGraphQL(makeMetricsQuery(origin, dest));
      if (data.data?.viewer?.metricFamilies?.length > 0) {
        allData[key] = data.data.viewer;
        console.log(`  ✓ ${key} - ${data.data.viewer.metricFamilies.length} metric families`);
      } else {
        console.log(`  ⚠ ${key} - no data`);
      }
    } catch (e) {
      console.log(`  ✗ ${key} - ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Fetch German region-to-region data
  console.log('\nFetching German regional data...\n');
  for (const originRegion of DE_REGIONS) {
    for (const destRegion of DE_REGIONS) {
      if (originRegion === 'ALL' && destRegion === 'ALL') continue; // Already have this from DE-DE
      const key = `DE-${originRegion.replace('Germany ', '')}-DE-${destRegion.replace('Germany ', '')}`;
      console.log(`Fetching ${key}...`);
      try {
        const data = await fetchGraphQL(makeMetricsQuery('DE', 'DE', originRegion, destRegion));
        if (data.data?.viewer?.metricFamilies?.length > 0) {
          allData[key] = data.data.viewer;
          console.log(`  ✓ ${key}`);
        } else {
          console.log(`  ⚠ ${key} - no data`);
        }
      } catch (e) {
        console.log(`  ✗ ${key} - ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 150));
    }
  }
  
  // Save all data to a single file
  const outPath = path.join(laneOverviewDir, 'all-lanes.json');
  fs.writeFileSync(outPath, JSON.stringify(allData, null, 2));
  console.log(`\n✓ Saved ${Object.keys(allData).length} lane combinations to ${outPath}`);
  console.log(`  File size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
