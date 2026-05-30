"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  ARTICLES,
  CATEGORIES,
  formatArticleDate,
  getCategory,
  type Article,
  type CategoryKey,
} from "./newsData";

/**
 * News — Shenatech editorial feed at /dashboard/benchmark/news.
 *
 * Top-down:
 *   1. Header: title + sub + search box + Subscribe button
 *   2. Category filter pills (All / Ports / Diesel / Carriers / ...)
 *   3. Featured article card (only when no filter / search is active)
 *   4. 3-column article grid
 *   5. Empty state (if filter + search yields nothing)
 *   6. "Load more" CTA at the bottom
 *
 * Filtering is real and instant: clicking a category narrows the grid,
 * typing in the search box filters by title + excerpt text.
 */
export function News() {
  const { lang, t } = useLanguage();

  // ── State ────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");

  // ── Apply category + search filtering ────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const matchCategory = activeCategory === "all" || a.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      const titleText = t(a.titleKey).toLowerCase();
      const excerptText = t(a.excerptKey).toLowerCase();
      return titleText.includes(q) || excerptText.includes(q);
    });
  }, [activeCategory, search, t]);

  // Featured article — only shown on the unfiltered/un-searched "All" view
  const showFeatured = activeCategory === "all" && search.trim() === "";
  const featured = ARTICLES.find((a) => a.featured);
  const grid = showFeatured
    ? filtered.filter((a) => !a.featured)
    : filtered;

  return (
    <div className="ro-page news-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="news-header">
        <div className="news-header__text">
          <h1 className="news-header__title"><T id="news.title" /></h1>
          <p className="news-header__sub"><T id="news.sub" /></p>
        </div>
        <div className="news-header__actions">
          <label className="news-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("news.search.placeholder")}
              aria-label={t("news.search.placeholder")}
            />
          </label>
          <button type="button" className="news-subscribe">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 11v2a3 3 0 0 0 3 3h1l4 4V4l-4 4H6a3 3 0 0 0-3 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8a5 5 0 0 1 0 8M19 5a8 8 0 0 1 0 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <T id="news.subscribe" />
          </button>
        </div>
      </header>

      {/* ─── Category filter pills ─────────────────────────────── */}
      <nav className="news-filters" aria-label={t("news.filters.aria")}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.key;
          // Compute count per category — small but useful
          const count =
            cat.key === "all"
              ? ARTICLES.length
              : ARTICLES.filter((a) => a.category === cat.key).length;
          return (
            <button
              key={cat.key}
              type="button"
              className={`news-filter-pill${active ? " is-active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={active}
            >
              <T id={cat.labelKey} />
              <span className="news-filter-pill__count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* ─── Featured article ──────────────────────────────────── */}
      {showFeatured && featured && <FeaturedCard article={featured} lang={lang} />}

      {/* ─── Article grid OR empty state ───────────────────────── */}
      {grid.length > 0 ? (
        <>
          <section className="news-grid" aria-label={t("news.grid.aria")}>
            {grid.map((article) => (
              <ArticleCard key={article.id} article={article} lang={lang} />
            ))}
          </section>
          <div className="news-load-more-wrap">
            <button type="button" className="news-load-more">
              <T id="news.load_more" />
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="news-empty" role="status">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h2 className="news-empty__title"><T id="news.empty.title" /></h2>
          <p className="news-empty__sub"><T id="news.empty.sub" /></p>
          <button
            type="button"
            className="news-empty__reset"
            onClick={() => {
              setActiveCategory("all");
              setSearch("");
            }}
          >
            <T id="news.empty.reset" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Featured card (large, split layout) ─────────────────────────────
function FeaturedCard({ article, lang }: { article: Article; lang: "en" | "ar" }) {
  const cat = getCategory(article.category);
  return (
    <article className="news-featured">
      <div className="news-featured__body">
        <div className="news-featured__top">
          <span className="news-featured__featured-badge">
            <span className="news-featured__featured-dot" aria-hidden="true" />
            <T id="news.featured_badge" />
          </span>
          <span
            className="news-featured__cat"
            style={{ color: cat.color, borderColor: cat.color }}
          >
            <T id={cat.labelKey} />
          </span>
        </div>
        <h2 className="news-featured__title">
          <T id={article.titleKey} />
        </h2>
        <p className="news-featured__excerpt">
          <T id={article.excerptKey} />
        </p>
        <div className="news-featured__meta">
          <T id={article.authorKey} />
          <span aria-hidden="true">·</span>
          <span>{formatArticleDate(article.dateISO, lang)}</span>
          <span aria-hidden="true">·</span>
          <span>
            {article.readMinutes} <T id="news.read_minutes" />
          </span>
        </div>
        <button type="button" className="news-featured__cta">
          <T id="news.read_article" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="news-featured__image" style={{ background: cat.gradient }} aria-hidden="true">
        <CategoryIcon category={article.category} large />
      </div>
    </article>
  );
}

// ─── Regular grid card ───────────────────────────────────────────────
function ArticleCard({ article, lang }: { article: Article; lang: "en" | "ar" }) {
  const cat = getCategory(article.category);
  return (
    <article className="news-card">
      <div
        className="news-card__image"
        style={{ background: cat.gradient }}
        aria-hidden="true"
      >
        <CategoryIcon category={article.category} />
      </div>
      <div className="news-card__body">
        <span
          className="news-card__cat"
          style={{ color: cat.color, borderColor: cat.color }}
        >
          <T id={cat.labelKey} />
        </span>
        <h3 className="news-card__title">
          <T id={article.titleKey} />
        </h3>
        <p className="news-card__excerpt">
          <T id={article.excerptKey} />
        </p>
        <div className="news-card__meta">
          <span>{formatArticleDate(article.dateISO, lang)}</span>
          <span aria-hidden="true">·</span>
          <span>
            {article.readMinutes} <T id="news.read_minutes" />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Category icon — decorative SVG used inside the gradient image ──
function CategoryIcon({
  category,
  large = false,
}: {
  category: Exclude<CategoryKey, "all">;
  large?: boolean;
}) {
  const size = large ? 120 : 56;
  const className = large ? "news-icon news-icon--large" : "news-icon";
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", className };
  switch (category) {
    case "ports":
      // Stacked shipping containers
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 18h18M5 18V8h6v10M13 18V11h6v7M7 11h2M7 14h2M15 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "diesel":
      // Fuel pump
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 13h11M16 9l3 3v5a2 2 0 0 1-4 0M19 12V7l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "carriers":
      // Truck
      return (
        <svg {...common} aria-hidden="true">
          <path d="M1 17V6h14v11M15 9h4l3 4v4h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "industry":
      // Factory
      return (
        <svg {...common} aria-hidden="true">
          <path d="M2 20V10l5 3V10l5 3V10l5 3v7zM6 16h0M11 16h0M16 16h0M22 20H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "policy":
      // Scroll/document
      return (
        <svg {...common} aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "tech":
      // Chip
      return (
        <svg {...common} aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 10h4v4h-4zM2 9h4M2 13h4M2 17h4M18 9h4M18 13h4M18 17h4M9 2v4M13 2v4M17 2v4M9 18v4M13 18v4M17 18v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
