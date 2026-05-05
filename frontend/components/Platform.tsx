"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * Section 003 · The Platform — Tabbed feature showcase
 *
 * Tab nav at the top selects one of 4 capabilities. Below the tabs is a
 * single active panel with split layout: text content on the left + a
 * unique CSS-built product mockup on the right (different mockup per
 * capability). Auto-rotates every 5s; pauses on hover.
 */
export function Platform() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const caps: { key: "01" | "02" | "03" | "04"; mockup: React.ReactNode }[] = [
    { key: "01", mockup: <VisibilityMockup /> },
    { key: "02", mockup: <PredictionMockup /> },
    { key: "03", mockup: <MarketplaceMockup /> },
    { key: "04", mockup: <DocumentationMockup /> },
  ];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % caps.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, caps.length]);

  return (
    <section className="platform" id="platform" aria-labelledby="platform-heading">
      <div className="container">
        <div className="platform__intro">
          <div className="reveal">
            <T as="p" id="platform.index" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true"></span>
            <h2
              id="platform-heading"
              className="display-lg"
              dangerouslySetInnerHTML={{ __html: t("platform.heading_html") }}
            />
          </div>
        </div>

        <div
          className="platform-showcase"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab navigation */}
          <div className="platform-tabs" role="tablist" aria-label="Platform capabilities">
            {caps.map((cap, i) => (
              <button
                key={cap.key}
                type="button"
                role="tab"
                className={`platform-tab${i === activeIndex ? " is-active" : ""}`}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                aria-selected={i === activeIndex}
                aria-controls={`platform-panel-${cap.key}`}
              >
                <span className="platform-tab__num">{cap.key}</span>
                <T id={`offering.${cap.key}.tag`} as="span" className="platform-tab__name" />
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="platform-panels">
            {caps.map((cap, i) => (
              <div
                key={cap.key}
                id={`platform-panel-${cap.key}`}
                role="tabpanel"
                className={`platform-panel${i === activeIndex ? " is-active" : ""}`}
                aria-hidden={i !== activeIndex}
              >
                <div className="platform-panel__text">
                  <T as="span" id={`offering.${cap.key}.tag`} className="platform-panel__tag" />
                  {cap.key === "04" ? (
                    <h3
                      className="platform-panel__title"
                      dangerouslySetInnerHTML={{ __html: t("offering.04.title_html") }}
                    />
                  ) : (
                    <T as="h3" id={`offering.${cap.key}.title`} className="platform-panel__title" />
                  )}
                  <T as="p" id={`offering.${cap.key}.body`} className="platform-panel__body" />
                </div>
                <div className="platform-panel__mockup" aria-hidden="true">
                  {cap.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   CSS-built product mockups — one per capability. Pure presentational.
   ────────────────────────────────────────────────────────────────────── */

function MockFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mock-frame">
      <div className="mock-frame__chrome">
        <span className="mock-frame__dot mock-frame__dot--r" />
        <span className="mock-frame__dot mock-frame__dot--y" />
        <span className="mock-frame__dot mock-frame__dot--g" />
        <span className="mock-frame__title">{title}</span>
      </div>
      <div className="mock-frame__body">{children}</div>
    </div>
  );
}

function VisibilityMockup() {
  // Toggles between the list/timeline view and the map view of SHN-2847.
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  if (viewMode === "map") {
    return (
      <MockFrame title="Live Tracking · SHN-2847">
        <div className="mock-vmap">
          <button
            type="button"
            className="mock-vmap__back"
            onClick={() => setViewMode("list")}
            aria-label="Back to shipments list"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M7.5 2L3.5 5.5 7.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          {/* Real branded map image (route, cities, customs, current pin baked in) */}
          <img
            src="/illustrations/visibility-map.jpg"
            alt="Live shipment tracking map: SHN-2847 from Jebel Ali to Doha"
            className="mock-vmap__img"
          />
          <div className="mock-vmap__info">
            <span className="mock-vmap__info-loc">
              <span className="mock-vmap__info-pin" aria-hidden="true">●</span>
              SHN-2847 · 282 km from Doha
            </span>
            <span className="mock-vmap__info-time">Updated 2 min ago</span>
          </div>
        </div>
      </MockFrame>
    );
  }

  return (
    <MockFrame title="Live Shipments">
      <div className="mock-vis">
        <div className="mock-vis__header">
          <h4>Operations</h4>
          <span className="mock-vis__live">
            <span className="mock-vis__live-dot" />
            LIVE
          </span>
        </div>

        {/* Featured shipment with full route + milestones + current location */}
        <div className="mock-vis__featured">
          <div className="mock-vis__feat-head">
            <span className="mock-vis__id">SHN-2847</span>
            <span className="mock-vis__route">Jebel Ali → Doha</span>
            <span className="mock-status mock-status--transit">IN TRANSIT</span>
          </div>

          {/* 5-step milestone timeline */}
          <ol className="mock-vis__timeline">
            <li className="mock-vis__step is-done">
              <span className="mock-vis__step-dot" />
              <span className="mock-vis__step-lbl">Pickup</span>
            </li>
            <li className="mock-vis__step is-done">
              <span className="mock-vis__step-dot" />
              <span className="mock-vis__step-lbl">Customs</span>
            </li>
            <li className="mock-vis__step is-active">
              <span className="mock-vis__step-dot" />
              <span className="mock-vis__step-lbl">Transit</span>
            </li>
            <li className="mock-vis__step">
              <span className="mock-vis__step-dot" />
              <span className="mock-vis__step-lbl">Border</span>
            </li>
            <li className="mock-vis__step">
              <span className="mock-vis__step-dot" />
              <span className="mock-vis__step-lbl">Delivery</span>
            </li>
          </ol>

          {/* Current location + last update + "See on map" button */}
          <div className="mock-vis__loc">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5c-2.8 0-5 2.2-5 5 0 4 5 8 5 8s5-4 5-8c0-2.8-2.2-5-5-5z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="mock-vis__loc-text">In transit · 282 km from Doha</span>
            <button
              type="button"
              className="mock-vis__map-btn"
              onClick={() => setViewMode("map")}
              aria-label="See location on map"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2.5l3-1 4 2 1-0.5v8l-1 0.5-4-2-3 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M5 1.5v8M9 3.5v8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Map
            </button>
            <span className="mock-vis__loc-time">2 min ago</span>
          </div>
        </div>

        {/* Other shipments in compact list, each with a "more details" chevron */}
        <div className="mock-vis__rows">
          <div className="mock-vis__row">
            <span className="mock-vis__id">SHN-2851</span>
            <span className="mock-vis__route">Riyadh → Dammam</span>
            <span className="mock-status mock-status--port">AT PORT</span>
            <Chevron />
          </div>
          <div className="mock-vis__row">
            <span className="mock-vis__id">SHN-2839</span>
            <span className="mock-vis__route">Salalah → Muscat</span>
            <span className="mock-status mock-status--delivered">DELIVERED</span>
            <Chevron />
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function Chevron() {
  return (
    <svg
      className="mock-vis__chev"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 2L7.5 5.5 3.5 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PredictionMockup() {
  // A "predictions board" showing the engine handling multiple active forecasts.
  const predictions = [
    { id: "SHN-2847", route: "Jebel Ali → Doha",      day: "Mon", time: "14:32", conf: 94, status: "on" as const },
    { id: "SHN-2851", route: "Riyadh → Dammam",       day: "Mon", time: "16:10", conf: 88, status: "on" as const },
    { id: "SHN-2862", route: "Doha → Bahrain",        day: "Tue", time: "09:45", conf: 91, status: "on" as const },
    { id: "SHN-2873", route: "Dammam → Manama",       day: "Tue", time: "13:20", conf: 76, status: "delay" as const },
  ];

  return (
    <MockFrame title="Prediction Engine">
      <div className="mock-pe">
        {/* Header */}
        <div className="mock-pe__header">
          <h4>Active forecasts</h4>
          <span className="mock-pe__count">23 deliveries · this week</span>
        </div>

        {/* KPI strip — three small stat cards */}
        <div className="mock-pe__kpis">
          <div className="mock-pe__kpi">
            <span className="mock-pe__kpi-num">94<span className="mock-pe__kpi-unit">%</span></span>
            <span className="mock-pe__kpi-lbl">on-time</span>
          </div>
          <div className="mock-pe__kpi">
            <span className="mock-pe__kpi-num">±42<span className="mock-pe__kpi-unit">m</span></span>
            <span className="mock-pe__kpi-lbl">variance</span>
          </div>
          <div className="mock-pe__kpi">
            <span className="mock-pe__kpi-num">12k<span className="mock-pe__kpi-unit">+</span></span>
            <span className="mock-pe__kpi-lbl">trained on</span>
          </div>
        </div>

        {/* Prediction rows — each with a confidence bar */}
        <div className="mock-pe__list">
          {predictions.map((p) => (
            <div key={p.id} className={`mock-pe__row${p.status === "delay" ? " is-warn" : ""}`}>
              <div className="mock-pe__row-top">
                <span className="mock-pe__id">{p.id}</span>
                <span className="mock-pe__route">{p.route}</span>
                <span className="mock-pe__when">
                  <span className="mock-pe__when-day">{p.day}</span>
                  <span className="mock-pe__when-time">{p.time}</span>
                </span>
              </div>
              <div className="mock-pe__row-bar">
                <div className="mock-pe__bar">
                  <div className="mock-pe__bar-fill" style={{ width: `${p.conf}%` }} />
                </div>
                <span className="mock-pe__conf">
                  {p.status === "delay" ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M5 1l4.5 8h-9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M5 4v2.5M5 7.5v0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {p.conf}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function MarketplaceMockup() {
  const offers = [
    { carrier: "Al-Bahar Logistics", rating: 4.9, truck: "40ft Reefer",   price: "QAR 4,250", eta: "2d 4h", best: true },
    { carrier: "Gulf Freight Co.",   rating: 4.5, truck: "40ft Standard", price: "QAR 4,580", eta: "2d 6h" },
    { carrier: "DesertLine Express", rating: 4.2, truck: "40ft Standard", price: "QAR 4,720", eta: "3d 1h" },
    { carrier: "Trans-Arabia Cargo", rating: 4.0, truck: "40ft Standard", price: "QAR 4,890", eta: "3d 4h" },
  ];

  return (
    <MockFrame title="Carrier Offers">
      <div className="mock-mkt">
        <div className="mock-mkt__top">
          <span className="mock-mkt__heading">5 quotes · SHN-2862</span>
          <span className="mock-mkt__lane">Doha → Bahrain · 40ft</span>
        </div>

        {offers.map((o, i) => (
          <div
            key={i}
            className={`mock-mkt__offer${o.best ? " mock-mkt__offer--best" : ""}`}
          >
            {o.best && <span className="mock-mkt__best-badge">BEST</span>}
            <div className="mock-mkt__col-1">
              <span className="mock-mkt__carrier">{o.carrier}</span>
              <span className="mock-mkt__rating" aria-label={`Rating ${o.rating}`}>
                <Stars filled={Math.floor(o.rating)} />
                <span className="mock-mkt__rating-num">{o.rating.toFixed(1)}</span>
              </span>
            </div>
            <div className="mock-mkt__col-2">
              <span className="mock-mkt__truck">{o.truck}</span>
            </div>
            <div className="mock-mkt__col-3">
              <span className="mock-mkt__price">{o.price}</span>
              <span className="mock-mkt__eta">{o.eta}</span>
            </div>
          </div>
        ))}

        <div className="mock-mkt__more">+1 more offer</div>
      </div>
    </MockFrame>
  );
}

function Stars({ filled }: { filled: number }) {
  return (
    <span className="mock-mkt__stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 0.6l1.35 2.74 3.02.44-2.18 2.13.51 3.01L5 7.5 2.3 8.92l.51-3.01L.63 3.78l3.02-.44L5 0.6z"
            fill={i < filled ? "#FCBA02" : "rgba(255,255,255,0.16)"}
          />
        </svg>
      ))}
    </span>
  );
}

function DocumentationMockup() {
  return (
    <MockFrame title="Digital BOL">
      <div className="mock-doc">
        {/* Two background docs at angles */}
        <div className="mock-doc__paper mock-doc__paper--back-2" />
        <div className="mock-doc__paper mock-doc__paper--back-1" />
        {/* Front doc with content */}
        <div className="mock-doc__paper mock-doc__paper--front">
          <div className="mock-doc__header">
            <span className="mock-doc__no">BOL-2847</span>
            <span className="mock-doc__seal">SIGNED</span>
          </div>
          <div className="mock-doc__lines">
            <span className="mock-doc__line" />
            <span className="mock-doc__line mock-doc__line--short" />
            <span className="mock-doc__line" />
          </div>
          <div className="mock-doc__checks">
            <span className="mock-doc__check">
              <CheckIcon /> Stamped
            </span>
            <span className="mock-doc__check">
              <CheckIcon /> Signed
            </span>
            <span className="mock-doc__check">
              <CheckIcon /> Sent
            </span>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M2 5.5l2 2 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
