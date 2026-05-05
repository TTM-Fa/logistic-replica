"use client";

import { T } from "@/lib/T";
import { useLanguage } from "@/lib/LanguageContext";

const DEMO_URL = "https://calendly.com/shenatech/30min";

/**
 * Section 005 · Live Demo (request-a-demo).
 *
 * Two-column dark section:
 *   - Left  → eyebrow, gold accent line, headline, sub, three bullets, two CTAs.
 *   - Right → faux product dashboard ("browser frame" with KPI cards and a
 *             shipments list) — a placeholder visual until real screenshots land.
 *
 * The right column is presentational only (aria-hidden) so screen readers
 * skip it.
 */
export function CTA() {
  const { t } = useLanguage();
  return (
    <section className="cta-section" id="demo" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-grid">
          {/* ─── LEFT — pitch ─── */}
          <div className="cta-pitch">
            <T as="p" id="cta.index" className="eyebrow" />
            <span className="gold-line" aria-hidden="true" />

            <h2 id="cta-heading" className="display-lg cta-section__headline reveal">
              {t("cta.headline")}
            </h2>
            <T as="p" id="cta.sub" className="cta-section__sub reveal" />

            <ul className="cta-bullets reveal" aria-label="What to expect">
              <li>
                <span className="cta-bullets__dot" aria-hidden="true" />
                <T id="cta.bullet.duration" />
              </li>
              <li>
                <span className="cta-bullets__dot" aria-hidden="true" />
                <T id="cta.bullet.tailored" />
              </li>
              <li>
                <span className="cta-bullets__dot" aria-hidden="true" />
                <T id="cta.bullet.live_qa" />
              </li>
            </ul>

            <div className="cta-section__actions reveal">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link"
              >
                <T id="hero.cta_demo" />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* ─── RIGHT — faux dashboard preview ─── */}
          <div className="cta-preview reveal" aria-hidden="true">
            <div className="cta-preview__frame">
              {/* macOS-style window chrome (decorative) */}
              <div className="cta-preview__chrome">
                <span className="cta-preview__dot cta-preview__dot--r" />
                <span className="cta-preview__dot cta-preview__dot--y" />
                <span className="cta-preview__dot cta-preview__dot--g" />
                <span className="cta-preview__url">shenatech.com / live</span>
              </div>

              <div className="cta-preview__body">
                {/* dashboard title + live pulse */}
                <div className="cta-preview__title-row">
                  <h3>Live Operations</h3>
                  <span className="cta-live-pill">
                    <span className="cta-live-dot" />
                    LIVE
                  </span>
                </div>

                {/* KPI strip */}
                <div className="cta-preview__kpis">
                  <div className="cta-kpi">
                    <p className="cta-kpi__label">ACTIVE SHIPMENTS</p>
                    <p className="cta-kpi__value">247</p>
                  </div>
                  <div className="cta-kpi">
                    <p className="cta-kpi__label">ON-TIME RATE</p>
                    <p className="cta-kpi__value">
                      94<span className="cta-kpi__unit">%</span>
                    </p>
                  </div>
                  <div className="cta-kpi">
                    <p className="cta-kpi__label">TODAY&apos;S BIDS</p>
                    <p className="cta-kpi__value cta-kpi__value--gold">38</p>
                  </div>
                </div>

                {/* Shipments list */}
                <div className="cta-preview__shipments">
                  <p className="cta-shipments__label">Active Shipments</p>
                  <div className="cta-shipment-row">
                    <span className="cta-shipment__id">SHN-2847</span>
                    <span className="cta-shipment__route">Jebel Ali → Doha</span>
                    <span className="cta-status cta-status--transit">IN TRANSIT</span>
                  </div>
                  <div className="cta-shipment-row">
                    <span className="cta-shipment__id">SHN-2851</span>
                    <span className="cta-shipment__route">Riyadh → Dammam</span>
                    <span className="cta-status cta-status--port">AT PORT</span>
                  </div>
                  <div className="cta-shipment-row">
                    <span className="cta-shipment__id">SHN-2839</span>
                    <span className="cta-shipment__route">Salalah → Muscat</span>
                    <span className="cta-status cta-status--delivered">DELIVERED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
