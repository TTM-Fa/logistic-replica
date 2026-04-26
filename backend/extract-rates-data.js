#!/usr/bin/env node
/**
 * extract-rates-data.js
 * Parses frozen HTML files to extract rates & capacity data into JSON.
 * CW headers (CW13→CW13 wrapping year boundary) are converted to ISO dates
 * anchored to api-data/lane-overview/metrics.json (starts 2024-03-25).
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, 'site-insights');
const API  = path.join(__dirname, 'api-data');

// ── Date anchor: lane-overview starts CW13 2024 = 2024-03-25 ──
const ANCHOR_DATE = new Date('2024-03-25T00:00:00.000Z');
const TOTAL_WEEKS = 105;

function weekDates() {
  const dates = [];
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const d = new Date(ANCHOR_DATE);
    d.setUTCDate(d.getUTCDate() + i * 7);
    dates.push(d.toISOString().replace('.000Z', '.000Z'));
  }
  return dates;
}

// ── Extract indexValue + diff from HTML ──
function extractValues(html) {
  const vals = [];
  const re = /data-testid="indexValue">([^<]+)<\/span>(?:<span[^>]*aria-label="relative difference[^"]*"[^>]*>([^<]*)<\/span>)?/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    vals.push({ value: parseFloat(m[1]), diff: m[2] || null });
  }
  return vals;
}

// ── Extract spot-vs-contract table ──
function extractSpotVsContract(html) {
  // Headers: 2 rows. Row 0 has CW columns, row 1 has Contract/Spot/Diff sub-columns
  const headerMatch = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/);
  const cwHeaders = [];
  if (headerMatch) {
    const rows = [...headerMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    if (rows[0]) {
      const cells = [...rows[0][1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      // First 2 are # and Lane, rest are CW headers
      for (let i = 2; i < cells.length; i++) cwHeaders.push(cells[i]);
    }
  }

  // Data rows
  const allRows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  const dataRows = allRows.filter(r => r[1].includes('€') && r[1].includes('<td'));
  const lanes = [];

  for (const row of dataRows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)]
      .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length < 3) continue;

    const rank = cells[0].replace('.', '').trim();
    if (!rank) continue;

    // Parse lane: "Germany East → Germany NortheastDistance: 242km"
    const laneRaw = cells[1];
    const laneMatch = laneRaw.match(/(.+?)\s*→\s*(.+?)Distance:\s*(\d+)km/);
    const lane = laneMatch
      ? { from: laneMatch[1].trim(), to: laneMatch[2].trim(), distance: parseInt(laneMatch[3]) }
      : { from: laneRaw, to: '', distance: 0 };

    // Each CW has 3 values: Contract, Spot, Diff
    const weeks = [];
    const priceCells = cells.slice(2);
    for (let i = 0; i < priceCells.length; i += 3) {
      const contract = parseFloat(priceCells[i].replace('€', '').replace(',', ''));
      const spot = parseFloat(priceCells[i + 1].replace('€', '').replace(',', ''));
      const diff = parseFloat(priceCells[i + 2].replace('€', '').replace(',', ''));
      weeks.push({ contract, spot, diff });
    }

    lanes.push({ rank: parseInt(rank), lane, weeks });
  }

  return { cwHeaders, lanes };
}

// ── Build rates JSON (3 metrics × 105 points) ──
function buildRatesJson(html) {
  const dates = weekDates();
  const allVals = extractValues(html);

  // 315 values = 3 rows × 105 columns
  // Row order from data-testid: spot-price, contract-price, spread
  const rowSize = TOTAL_WEEKS;
  const metrics = {
    'spot-price': [],
    'contract-price': [],
    'spot-offer-spread': [],
  };
  const keys = Object.keys(metrics);

  for (let r = 0; r < keys.length; r++) {
    const start = r * rowSize;
    for (let i = 0; i < rowSize; i++) {
      const entry = allVals[start + i];
      if (entry) {
        metrics[keys[r]].push([dates[i], entry.value, entry.diff]);
      }
    }
  }

  return metrics;
}

// ── Build capacity JSON (2 metrics × 105 points) ──
function buildCapacityJson(html) {
  const dates = weekDates();
  const allVals = extractValues(html);

  // 210 values = 2 rows × 105 columns
  const rowSize = TOTAL_WEEKS;
  const metrics = {
    'capacity-index': [],
    'spot-price-index': [],
  };
  const keys = Object.keys(metrics);

  for (let r = 0; r < keys.length; r++) {
    const start = r * rowSize;
    for (let i = 0; i < rowSize; i++) {
      const entry = allVals[start + i];
      if (entry) {
        metrics[keys[r]].push([dates[i], entry.value, entry.diff]);
      }
    }
  }

  return metrics;
}

// ── Main ──
function main() {
  // Rates Overview
  const ratesHtml = fs.readFileSync(path.join(SITE, 'road-rates-overview.html'), 'utf8');
  const ratesData = buildRatesJson(ratesHtml);
  const ratesDir = path.join(API, 'rates');
  fs.mkdirSync(ratesDir, { recursive: true });
  fs.writeFileSync(path.join(ratesDir, 'metrics.json'), JSON.stringify(ratesData, null, 2));
  console.log(`✓ rates/metrics.json — ${Object.values(ratesData).reduce((s, a) => s + a.length, 0)} datapoints`);

  // Capacity
  const capHtml = fs.readFileSync(path.join(SITE, 'road-capacity.html'), 'utf8');
  const capData = buildCapacityJson(capHtml);
  const capDir = path.join(API, 'capacity');
  fs.mkdirSync(capDir, { recursive: true });
  fs.writeFileSync(path.join(capDir, 'metrics.json'), JSON.stringify(capData, null, 2));
  console.log(`✓ capacity/metrics.json — ${Object.values(capData).reduce((s, a) => s + a.length, 0)} datapoints`);

  // Spot vs Contract
  const svcHtml = fs.readFileSync(path.join(SITE, 'road-rates-spot-vs-contract.html'), 'utf8');
  const svcData = extractSpotVsContract(svcHtml);
  fs.writeFileSync(path.join(ratesDir, 'spot-vs-contract.json'), JSON.stringify(svcData, null, 2));
  console.log(`✓ rates/spot-vs-contract.json — ${svcData.lanes.length} lanes × ${svcData.cwHeaders.length} weeks`);
}

main();
