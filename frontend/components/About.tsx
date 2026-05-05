"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

// Three core values shown as cards. To rename / reorder / add a value,
// edit this list and add the matching keys to translations.ts.
const VALUES: { key: string; icon: React.ReactNode }[] = [
  {
    key: "visibility",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "trust",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "speed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Placeholder KPI stats — swap with real numbers when available.
const STATS: { key: string }[] = [
  { key: "stat1" }, // e.g. years of combined experience
  { key: "stat2" }, // e.g. shipments tracked in pilots
  { key: "stat3" }, // e.g. ports & corridors covered
  { key: "stat4" }, // e.g. avg integration time
];

export function About() {
  const { t } = useLanguage();

  return (
    <>
      {/* ─── Dark hero (subpage-dark-hero pattern, same as /contact and /faq) ─── */}
      <section className="faq-hero faq-hero--dark about-hero">
        <div className="container">
          <div className="faq-hero__inner reveal">
            <T as="p" id="about.hero.eyebrow" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true" />
            <h1
              className="display-lg faq-hero__heading"
              dangerouslySetInnerHTML={{ __html: t("about.hero.heading_html") }}
            />
            <T as="p" id="about.hero.sub" className="faq-hero__sub" />
            <div className="faq-hero__status" aria-hidden="true">
              <span className="faq-hero__status-dot" />
              <T id="about.hero.status" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__inner reveal">
            <T as="p" id="about.mission.eyebrow" className="eyebrow" />
            <span className="gold-line" aria-hidden="true" />
            <h2
              className="display-md about-mission__heading"
              dangerouslySetInnerHTML={{ __html: t("about.mission.heading_html") }}
            />
            <T as="p" id="about.mission.body" className="about-mission__body" />
          </div>
        </div>
      </section>

      {/* ─── What we believe — 3 value cards ─── */}
      <section className="about-values">
        <div className="container">
          <div className="about-values__intro reveal">
            <T as="p" id="about.values.eyebrow" className="eyebrow" />
            <span className="gold-line" aria-hidden="true" />
            <T as="h2" id="about.values.heading" className="display-md" />
          </div>
          <div className="about-values__grid">
            {VALUES.map((v) => (
              <div key={v.key} className="about-value reveal">
                <span className="about-value__icon">{v.icon}</span>
                <T as="h3" id={`about.values.${v.key}.title`} className="about-value__title" />
                <T as="p" id={`about.values.${v.key}.desc`} className="about-value__desc" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── By the numbers (dark band) ─── */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__inner reveal">
            <T as="p" id="about.stats.eyebrow" className="eyebrow" />
            <T as="h2" id="about.stats.heading" className="about-stats__heading" />
            <div className="about-stats__grid">
              {STATS.map((s) => (
                <div key={s.key} className="about-stat">
                  <T as="span" id={`about.stats.${s.key}.value`} className="about-stat__value" />
                  <T as="span" id={`about.stats.${s.key}.label`} className="about-stat__label" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Team blurb ─── */}
      <section className="about-team">
        <div className="container">
          <div className="about-team__inner reveal">
            <T as="p" id="about.team.eyebrow" className="eyebrow" />
            <span className="gold-line" aria-hidden="true" />
            <T as="h2" id="about.team.heading" className="display-md" />
            <T as="p" id="about.team.body" className="about-team__body" />
          </div>
        </div>
      </section>

      {/* ─── CTA tiles (same pattern as FAQ bottom) ─── */}
      <section className="faq-cta">
        <div className="container">
          <T as="h2" id="about.cta.heading" className="faq-cta__heading reveal" />
          <div className="faq-cta__tiles reveal">
            <Link href="/contact" className="extra-tile">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <path d="M3 7l9 6 9-6M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="about.cta.tile1.heading" className="extra-tile__heading" />
                <T as="p" id="about.cta.tile1.desc" className="extra-tile__desc" />
              </div>
              <span className="extra-tile__cta extra-tile__cta--gold">
                <T id="about.cta.tile1.cta" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="extra-tile">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="about.cta.tile2.heading" className="extra-tile__heading" />
                <T as="p" id="about.cta.tile2.desc" className="extra-tile__desc" />
              </div>
              <span className="extra-tile__cta extra-tile__cta--gold">
                <T id="about.cta.tile2.cta" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
