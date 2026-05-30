"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { ARTICLES, CATEGORIES, PULSE, type Article, type Category } from "./perspectivesData";

/**
 * Perspectives — the Marketplace → Freight Perspectives page.
 *
 * A market-pulse strip, category filter pills, a featured article, and a
 * grid of insight cards. Category-coloured banners stand in for photos
 * (original, theme-aware). Mock data / original copy.
 */

// Per-category icon (drawn inside the banner).
const CAT_ICON: Record<Category, React.ReactNode> = {
  rates: <path d="M3 17l6-6 4 4 7-8M14 7h7v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  capacity: <path d="M1 17V6h14v11M15 9h4l3 4v4h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  fuel: <path d="M3 22h11V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18zM14 9h2l3 3v6a2 2 0 0 1-4 0v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  regulation: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zM9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  trade: <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Perspectives() {
  const { t, lang } = useLanguage();
  const [cat, setCat] = useState<Category | "all">("all");

  const filtered = useMemo(
    () => (cat === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === cat)),
    [cat],
  );
  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  const meta = (a: Article) =>
    `${lang === "ar" ? a.authorAr : a.author} · ${a.dateDaysAgo === 0 ? t("marketplace.spot.day.today") : `${a.dateDaysAgo}${t("visibility.no.unit_d")} ${t("visibility.vm.ago")}`} · ${a.readMin} ${t("marketplace.fp.read_min")}`;

  return (
    <div className="ro-page mp-fp">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.fp.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.fp.sub" /></p>
        </div>
      </header>

      {/* ─── Market pulse ───────────────────────────────────────── */}
      <div className="mp-fp-pulse">
        {PULSE.map((p) => (
          <div key={p.labelKey} className="mp-fp-pulse__item">
            <span className="mp-fp-pulse__label"><T id={p.labelKey} /></span>
            <span className="mp-fp-pulse__value">{p.value}</span>
            <span className={`mp-fp-pulse__delta mp-fp-pulse__delta--${p.dir}`}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" aria-hidden="true">
                {p.dir === "up"
                  ? <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
              {p.delta}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Category filter ────────────────────────────────────── */}
      <nav className="vis-tr-tabs" aria-label={t("marketplace.fp.filter_aria")}>
        <button type="button" className={`vis-tr-tab${cat === "all" ? " is-active" : ""}`} onClick={() => setCat("all")}>
          <T id="marketplace.fp.cat.all" />
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={`vis-tr-tab${cat === c ? " is-active" : ""}`} onClick={() => setCat(c)}>
            <T id={`marketplace.fp.cat.${c}`} />
          </button>
        ))}
      </nav>

      {/* ─── Featured ───────────────────────────────────────────── */}
      {featured && (
        <article className={`mp-fp-featured mp-fp-cat--${featured.category}`}>
          <div className="mp-fp-featured__banner" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none">{CAT_ICON[featured.category]}</svg>
          </div>
          <div className="mp-fp-featured__body">
            <span className="mp-fp-tag"><T id={`marketplace.fp.cat.${featured.category}`} /></span>
            <span className="mp-fp-featured__badge"><T id="marketplace.fp.featured" /></span>
            <h2 className="mp-fp-featured__title">{lang === "ar" ? featured.titleAr : featured.title}</h2>
            <p className="mp-fp-featured__excerpt">{lang === "ar" ? featured.excerptAr : featured.excerpt}</p>
            <div className="mp-fp-featured__foot">
              <span className="mp-fp-meta">{meta(featured)}</span>
              <button type="button" className="mp-lane-details"><T id="marketplace.fp.read" /></button>
            </div>
          </div>
        </article>
      )}

      {/* ─── Article grid ───────────────────────────────────────── */}
      <div className="mp-fp-grid">
        {rest.map((a) => (
          <article key={a.id} className={`mp-fp-card mp-fp-cat--${a.category}`}>
            <div className="mp-fp-card__banner" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none">{CAT_ICON[a.category]}</svg>
              <span className="mp-fp-tag"><T id={`marketplace.fp.cat.${a.category}`} /></span>
            </div>
            <div className="mp-fp-card__body">
              <h3 className="mp-fp-card__title">{lang === "ar" ? a.titleAr : a.title}</h3>
              <p className="mp-fp-card__excerpt">{lang === "ar" ? a.excerptAr : a.excerpt}</p>
              <span className="mp-fp-meta">{meta(a)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
