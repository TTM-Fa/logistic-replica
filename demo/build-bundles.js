#!/usr/bin/env node
/**
 * Build all inject bundles using esbuild.
 * Run from the demo/ directory: node build-bundles.js
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'site-insights', 'js');

const bundles = [
  { name: 'lane-overview',     entry: 'src/inject/lane-overview.jsx',     globalName: 'LaneOverview' },
  { name: 'lane-comparison',   entry: 'src/inject/lane-comparison.jsx',   globalName: 'LaneComparison' },
  { name: 'yearly-comparison', entry: 'src/inject/yearly-comparison.jsx', globalName: 'YearlyComparison' },
  { name: 'top-movers',        entry: 'src/inject/top-movers.jsx',        globalName: 'TopMovers' },
  { name: 'rates-overview',    entry: 'src/inject/rates-overview.jsx',    globalName: 'RatesOverview' },
  { name: 'capacity',          entry: 'src/inject/capacity.jsx',          globalName: 'Capacity' },
  { name: 'spot-vs-contract',  entry: 'src/inject/spot-vs-contract.jsx',  globalName: 'SpotVsContract' },
];

const sharedConfig = {
  bundle: true,
  format: 'iife',
  platform: 'browser',
  minify: true,
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};

console.log(`Building ${bundles.length} bundles → ${outDir}\n`);

for (const { name, entry, globalName } of bundles) {
  process.stdout.write(`  Building ${name}...`);
  const start = Date.now();
  try {
    await build({
      ...sharedConfig,
      entryPoints: [join(__dirname, entry)],
      outfile: join(outDir, `${name}.bundle.js`),
      globalName,
    });
    console.log(` ✓ (${Date.now() - start}ms)`);
  } catch (err) {
    console.error(` ✗\n${err.message}`);
    process.exit(1);
  }
}

console.log('\nAll bundles built successfully.');
