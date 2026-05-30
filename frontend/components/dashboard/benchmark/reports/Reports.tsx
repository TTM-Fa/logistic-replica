"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  REPORTS,
  SOURCE_META,
  TABS,
  countForTab,
  filterByTab,
  formatRelative,
  type Report,
  type TabKey,
} from "./reportsData";

/**
 * Reports — "My Reports" page at /dashboard/benchmark/reports.
 *
 * Top-down:
 *   1. Header: title + sub + "+ New report" gold CTA
 *   2. Tabs: All / Favorites / Recent / Shared (with counts)
 *   3. Grid of saved report cards with mini-preview, favorite star,
 *      "shared by" badge, source page link, last-opened relative date,
 *      and a lifetime open count
 *   4. Empty state per-tab when the active tab has no reports
 *
 * In production, "Add to dashboard" buttons on Rates/Capacity/etc.
 * would create new entries here. For now it's a fixed mock list — the
 * `+ New report` CTA in the header is wired but doesn't save anything yet.
 */
export function Reports() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  // Local favorite state so the star is interactive in the demo
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(REPORTS.filter((r) => r.favorite).map((r) => r.id)),
  );

  // Apply the favorites override on top of the static mock data
  const reportsWithFavorites = useMemo(
    () => REPORTS.map((r) => ({ ...r, favorite: favorites.has(r.id) })),
    [favorites],
  );

  const visible = useMemo(
    () => filterByTab(activeTab, reportsWithFavorites),
    [activeTab, reportsWithFavorites],
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="ro-page reports-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="reports-header">
        <div className="reports-header__text">
          <h1 className="reports-header__title"><T id="reports.title" /></h1>
          <p className="reports-header__sub"><T id="reports.sub" /></p>
        </div>
        <button type="button" className="reports-new">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <T id="reports.new" />
        </button>
      </header>

      {/* ─── Tabs ──────────────────────────────────────────────── */}
      <nav className="reports-tabs" aria-label={t("reports.tabs.aria")}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          const count = countForTab(tab.key, reportsWithFavorites);
          return (
            <button
              key={tab.key}
              type="button"
              className={`reports-tab${active ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={active}
            >
              <T id={tab.labelKey} />
              <span className="reports-tab__count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* ─── Grid of cards OR empty state ──────────────────────── */}
      {visible.length > 0 ? (
        <section className="reports-grid" aria-label={t("reports.grid.aria")}>
          {visible.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              lang={lang}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </section>
      ) : (
        <EmptyState tab={activeTab} />
      )}
    </div>
  );
}

// ─── ReportCard ──────────────────────────────────────────────────────
function ReportCard({
  report,
  lang,
  onToggleFavorite,
}: {
  report: Report;
  lang: "en" | "ar";
  onToggleFavorite: (id: string) => void;
}) {
  const sourceMeta = SOURCE_META[report.source];

  return (
    <article className="reports-card">
      {/* Top row: source + favorite + (optional) shared badge + more menu */}
      <header className="reports-card__top">
        <Link href={sourceMeta.href} className="reports-card__source" title={`Open source page`}>
          <SourceIcon source={report.source} />
          <T id={sourceMeta.labelKey} />
        </Link>
        <div className="reports-card__top-actions">
          {report.sharedBy && (
            <span className="reports-card__shared" title="Shared with you">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 10.5L15.5 6.5M8.5 13.5L15.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <T id="reports.shared" />
            </span>
          )}
          <button
            type="button"
            className={`reports-card__fav${report.favorite ? " is-on" : ""}`}
            onClick={() => onToggleFavorite(report.id)}
            aria-label={report.favorite ? "Remove from favorites" : "Add to favorites"}
            title={report.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={report.favorite ? "currentColor" : "none"} aria-hidden="true">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Title + description */}
      <div className="reports-card__body">
        <h3 className="reports-card__name"><T id={report.nameKey} /></h3>
        <p className="reports-card__desc"><T id={report.descKey} /></p>
      </div>

      {/* Mini preview — varies by report kind */}
      <div className="reports-card__preview">
        <Preview report={report} />
      </div>

      {/* Footer: shared-by attribution + last opened + open count */}
      <footer className="reports-card__footer">
        {report.sharedBy && (
          <span className="reports-card__shared-by">
            <T id="reports.shared_by" />:{" "}
            <strong><T id={report.sharedBy} /></strong>
          </span>
        )}
        <div className="reports-card__stats">
          <span title="Last opened">{formatRelative(report.lastOpenedISO, lang)}</span>
          <span aria-hidden="true">·</span>
          <span title="Lifetime opens">
            {report.opens} <T id="reports.opens" />
          </span>
        </div>
      </footer>
    </article>
  );
}

// ─── Preview shapes ──────────────────────────────────────────────────
function Preview({ report }: { report: Report }) {
  const { preview } = report;
  switch (preview.kind) {
    case "sparkline":
      return <Sparkline data={preview.data} color={preview.color} />;
    case "stacked-bar":
      return <StackedBar parts={preview.parts} />;
    case "kpi":
      return (
        <div className="reports-kpi">
          <span className="reports-kpi__value">{preview.value}</span>
          <span
            className={`reports-kpi__delta ${preview.deltaPct > 0 ? "is-up" : "is-down"}`}
          >
            {preview.deltaPct > 0 ? "↑" : "↓"} {Math.abs(preview.deltaPct).toFixed(1)}%
          </span>
        </div>
      );
    case "count":
      return (
        <div className="reports-count">
          <span className="reports-count__value">{preview.value}</span>
          <span className="reports-count__label">
            <T id={preview.label} />
          </span>
        </div>
      );
  }
}

// Small inline sparkline (used by most report cards)
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 240;
  const H = 56;
  const PAD = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (W - PAD * 2) / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => {
      const x = PAD + i * step;
      const y = PAD + (H - PAD * 2) - ((v - min) / range) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const last = data.length - 1;
  const area = `${PAD},${H} ${points} ${PAD + last * step},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="reports-spark" role="img" aria-label="trend">
      <polygon points={area} fill={color} fillOpacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={PAD + last * step}
        cy={PAD + (H - PAD * 2) - ((data[last] - min) / range) * (H - PAD * 2)}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// Horizontal stacked-bar preview (used by the cost breakdown report)
function StackedBar({
  parts,
}: {
  parts: { label: string; value: number; color: string }[];
}) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className="reports-stack">
      <div className="reports-stack__bar">
        {parts.map((p, i) => (
          <div
            key={i}
            className="reports-stack__seg"
            style={{
              width: `${(p.value / total) * 100}%`,
              background: p.color,
            }}
            title={`${p.label}: ${p.value}%`}
          />
        ))}
      </div>
      <div className="reports-stack__legend">
        {parts.map((p, i) => (
          <span key={i} className="reports-stack__legend-item">
            <span
              className="reports-stack__legend-swatch"
              style={{ background: p.color }}
              aria-hidden="true"
            />
            {p.label} <strong>{p.value}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

// Source-page icon (small, varies per source)
function SourceIcon({ source }: { source: Report["source"] }) {
  const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };
  switch (source) {
    case "rates_overview":
    case "rates_forecast":
    case "rates_spot_vs_contract":
      return (
        <svg {...common}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "capacity":
      return (
        <svg {...common}>
          <path d="M1 17V6h14v11M15 9h4l3 4v4h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "news":
      return (
        <svg {...common}>
          <path d="M4 4h14v16H4zM18 8h2v10a2 2 0 0 1-2 2M8 8h6M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "costs":
      return (
        <svg {...common}>
          <path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1 2-1V3l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "rod_spot":
    case "rod_contract":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
  }
}

// ─── Empty state ────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabKey }) {
  const titleKey = `reports.empty.${tab}.title`;
  const subKey = `reports.empty.${tab}.sub`;
  return (
    <div className="reports-empty">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 3h14v18l-7-5-7 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="reports-empty__title"><T id={titleKey} /></h2>
      <p className="reports-empty__sub"><T id={subKey} /></p>
    </div>
  );
}
