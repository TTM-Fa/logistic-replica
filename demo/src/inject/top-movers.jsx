/**
 * Top Movers chart injection.
 *
 * Since the scraped page shows an upsell notice, this replaces it
 * with actual top movers data including mini sparkline charts.
 *
 * Injection target: [data-testid="metric-upsell-notice"] parent container
 */
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
  LineChart, Line, ResponsiveContainer, YAxis,
} from 'recharts';
import { COLORS, parseWeek, formatValue } from './shared.js';

function Sparkline({ datapoints, color }) {
  const data = datapoints.map(([date, value]) => ({ value }));
  return (
    <div style={{ width: 100, height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <YAxis domain={['auto', 'auto']} hide />
          <Line type="monotone" dataKey="value" stroke={color} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MoverCard({ mover }) {
  const props = Object.fromEntries((mover.properties ?? []).map(p => [p.name, p.value]));
  const origin = props.lvl2_origin && props.lvl2_origin !== 'ALL'
    ? `${props.origin_country} – ${props.lvl2_origin}`
    : props.origin_country ?? '?';
  const dest = props.lvl2_destination && props.lvl2_destination !== 'ALL'
    ? `${props.destination_country} – ${props.lvl2_destination}`
    : props.destination_country ?? '?';

  const pct = mover.differenceInPercentage;
  const isUp = pct >= 0;
  // improvement=DECREASE means higher price is bad
  const isPositive = mover.improvement === 'DECREASE' ? !isUp : isUp;
  const color = isPositive ? '#43a047' : '#e53935';
  const arrow = isUp ? '▲' : '▼';

  const dps = mover.timeseries?.datapoints ?? [];
  const sparkColor = isUp ? '#e53935' : '#43a047';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      marginBottom: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Lane</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {origin} → {dest}
        </div>
      </div>

      <div style={{ textAlign: 'right', minWidth: 90 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Current</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>
          {formatValue(mover.current, mover.unit)}
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
          prev: {formatValue(mover.previous, mover.unit)}
        </div>
      </div>

      <div style={{ textAlign: 'center', minWidth: 70 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Change</div>
        <div style={{ fontSize: 15, fontWeight: 700, color }}>
          {arrow} {Math.abs(pct * 100).toFixed(1)}%
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
          {isUp ? '+' : ''}{formatValue(mover.difference, mover.unit)}
        </div>
      </div>

      {dps.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <Sparkline datapoints={dps} color={sparkColor} />
        </div>
      )}
    </div>
  );
}

function TopMoversView({ movers }) {
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });

  useEffect(() => {
    const onRegion = e => setRegion(prev => ({ ...prev, [e.detail.field]: e.detail.code }));
    document.addEventListener('tpr:region', onRegion);
    return () => document.removeEventListener('tpr:region', onRegion);
  }, []);

  if (!movers.length) {
    return <div className="lo-no-data">No top movers data available.</div>;
  }

  const sorted = [...movers].sort((a, b) =>
    Math.abs(b.differenceInPercentage) - Math.abs(a.differenceInPercentage)
  );

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 16 }}>
        Top Movers — Spot Price
      </div>
      {sorted.map(m => <MoverCard key={m.metricId} mover={m} />)}
    </div>
  );
}

async function init() {
  const upsellEl = document.querySelector('[data-testid="metric-upsell-notice"]');
  if (!upsellEl) return;

  upsellEl.style.visibility = 'visible';
  // Inject after the upsell notice or replace its parent content
  const container = upsellEl.parentElement ?? upsellEl;

  let data;
  try {
    const res = await fetch('/api-data/top-movers/movers.json');
    data = await res.json();
  } catch (e) {
    console.error('Top movers load failed:', e);
    return;
  }

  const movers = data?.data?.viewer?.metricFamily?.movers ?? [];

  // Create injection div, hide the upsell notice
  upsellEl.style.display = 'none';
  const mountEl = document.createElement('div');
  container.insertBefore(mountEl, upsellEl);
  createRoot(mountEl).render(<TopMoversView movers={movers} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
