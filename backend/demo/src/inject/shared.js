/**
 * Shared utilities for all injected chart components.
 */

export const COLORS = {
  spot: '#0073e6',
  contract: '#f5a623',
  diesel: '#00a3a3',
  // Yearly comparison year colors
  year2022: '#9b59b6',
  year2023: '#e74c3c',
  year2024: '#f5a623',
  year2025: '#0073e6',
  year2026: '#00a3a3',
  // Lane comparison colors
  lane1: '#0073e6',
  lane2: '#e74c3c',
};

/** Parse an ISO date string and return { year, week, date } */
export function parseWeek(isoStr) {
  const d = new Date(isoStr);
  const year = d.getUTCFullYear();
  // ISO week number
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const diffMs = d - startOfWeek1;
  const week = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return { year, week, date: d };
}

/** Format ISO date as "CW 12" */
export function formatCW(isoStr) {
  const { week } = parseWeek(isoStr);
  return `CW ${week}`;
}

/** Format ISO date as "CW 12, 2024" */
export function formatCWFull(isoStr) {
  const { year, week } = parseWeek(isoStr);
  return `CW ${week}, ${year}`;
}

/** Format a price value with unit */
export function formatValue(value, unit = 'EUR') {
  if (value == null) return '—';
  return `${value.toFixed(2)} ${unit}`;
}

/** Get the metricFamilies array safely */
export function getMetricFamilies(json) {
  return json?.data?.viewer?.metricFamilies ?? [];
}

/** Get metrics array from a metricFamily object */
export function getMetrics(family) {
  return family?.metrics?.metrics ?? [];
}

/** Get datapoints from a metric */
export function getDatapoints(metric) {
  return metric?.timeseries?.datapoints ?? [];
}

/** Build a label for a metric from its properties */
export function metricLabel(metric) {
  const props = Object.fromEntries(
    (metric.properties ?? []).map(p => [p.name, p.value])
  );
  const from = props.lvl2_origin && props.lvl2_origin !== 'ALL'
    ? `${props.origin_country} – ${props.lvl2_origin}`
    : props.origin_country ?? '?';
  const to = props.lvl2_destination && props.lvl2_destination !== 'ALL'
    ? `${props.destination_country} – ${props.lvl2_destination}`
    : props.destination_country ?? '?';
  return `${from} → ${to}`;
}
