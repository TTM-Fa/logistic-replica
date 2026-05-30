"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { COUNTRY_PERF, perfTotals } from "./networkData";

/**
 * RoadPerformance — Data Network sub-page showing how much of the road
 * network is delivering live GPS tracking: headline KPIs plus a
 * per-country tracking-rate breakdown with bars.
 */
export function RoadPerformance() {
  const { lang } = useLanguage();
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const totals = perfTotals(COUNTRY_PERF);

  // Colour the bar by how healthy the tracking rate is.
  const rateTone = (rate: number) => (rate >= 0.85 ? "ok" : rate >= 0.7 ? "warn" : "alert");

  return (
    <div className="ro-page vis-nw">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.nw.perf.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.nw.perf.sub" /></p>
        </div>
      </header>

      {/* Headline KPIs */}
      <div className="vis-nw-perfkpis">
        <div className="vis-nw-perfkpi vis-nw-perfkpi--rate">
          <span className="vis-nw-perfkpi__value">{Math.round(totals.rate * 100)}%</span>
          <span className="vis-nw-perfkpi__label"><T id="visibility.nw.perf.rate" /></span>
        </div>
        <div className="vis-nw-perfkpi">
          <span className="vis-nw-perfkpi__value vis-nw-perfkpi__value--ok">{fmt(totals.tracked)}</span>
          <span className="vis-nw-perfkpi__label"><T id="visibility.nw.perf.tracked" /> <T id="visibility.nw.perf.transports" /></span>
        </div>
        <div className="vis-nw-perfkpi">
          <span className="vis-nw-perfkpi__value vis-nw-perfkpi__value--alert">{fmt(totals.untracked)}</span>
          <span className="vis-nw-perfkpi__label"><T id="visibility.nw.perf.untracked" /> <T id="visibility.nw.perf.transports" /></span>
        </div>
      </div>

      {/* Per-country breakdown */}
      <section className="ro-card">
        <header className="ro-card__header">
          <div>
            <h2 className="ro-card__heading"><T id="visibility.nw.perf.by_country" /></h2>
          </div>
        </header>
        <div className="vis-nw-bars">
          {COUNTRY_PERF.map((row) => {
            const rate = row.total ? row.tracked / row.total : 0;
            const tone = rateTone(rate);
            return (
              <div key={row.id} className="vis-nw-bar">
                <span className="vis-nw-bar__name">{lang === "ar" ? row.nameAr : row.name}</span>
                <div className="vis-nw-bar__track" aria-hidden="true">
                  <div className={`vis-nw-bar__fill vis-nw-bar__fill--${tone}`} style={{ width: `${rate * 100}%` }} />
                </div>
                <span className="vis-nw-bar__pct">{Math.round(rate * 100)}%</span>
                <span className="vis-nw-bar__frac">
                  {fmt(row.tracked)} <T id="visibility.nw.perf.of" /> {fmt(row.total)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
