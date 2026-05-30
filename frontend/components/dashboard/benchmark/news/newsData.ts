/**
 * newsData.ts — Article catalogue for the News page.
 *
 * All content is original Shenatech editorial, GCC-focused — covering
 * ports & customs, diesel & costs, carriers, industry, policy, and
 * technology. Replace these with real CMS articles when the backend
 * lands; the page component reads `ARTICLES` and `CATEGORIES`
 * declaratively, so the only thing that needs to change is this file.
 */

// ─── Categories ───────────────────────────────────────────────────────

export type CategoryKey =
  | "all"
  | "ports"
  | "diesel"
  | "carriers"
  | "industry"
  | "policy"
  | "tech";

export type CategoryDef = {
  key: CategoryKey;
  labelKey: string;
  /** Gradient used as the card "image" placeholder */
  gradient: string;
  /** Accent color used for the category tag chip */
  color: string;
};

export const CATEGORIES: CategoryDef[] = [
  {
    key: "all",
    labelKey: "news.cat.all",
    gradient: "",
    color: "var(--d-accent)",
  },
  {
    key: "ports",
    labelKey: "news.cat.ports",
    gradient: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
    color: "#3B82F6",
  },
  {
    key: "diesel",
    labelKey: "news.cat.diesel",
    gradient: "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)",
    color: "#F59E0B",
  },
  {
    key: "carriers",
    labelKey: "news.cat.carriers",
    gradient: "linear-gradient(135deg, #6D28D9 0%, #A855F7 100%)",
    color: "#A855F7",
  },
  {
    key: "industry",
    labelKey: "news.cat.industry",
    gradient: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
    color: "#14B8A6",
  },
  {
    key: "policy",
    labelKey: "news.cat.policy",
    gradient: "linear-gradient(135deg, #15803D 0%, #22C55E 100%)",
    color: "#22C55E",
  },
  {
    key: "tech",
    labelKey: "news.cat.tech",
    gradient: "linear-gradient(135deg, #BE185D 0%, #EC4899 100%)",
    color: "#EC4899",
  },
];

/** Get the category definition for a given key (excluding "all") */
export function getCategory(key: CategoryKey): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

// ─── Articles ────────────────────────────────────────────────────────

export type Article = {
  id: string;
  category: Exclude<CategoryKey, "all">;
  titleKey: string;
  excerptKey: string;
  /** ISO date string — used for sorting + display */
  dateISO: string;
  /** Estimated reading time in minutes */
  readMinutes: number;
  authorKey: string;
  /** If true, rendered as the big featured card at the top */
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  // ── Featured ──
  {
    id: "hamad-customs-lane",
    category: "ports",
    titleKey: "news.article.hamad_customs.title",
    excerptKey: "news.article.hamad_customs.excerpt",
    dateISO: "2026-05-15",
    readMinutes: 6,
    authorKey: "news.author.insights_team",
    featured: true,
  },
  // ── Regular grid ──
  {
    id: "diesel-q3-outlook",
    category: "diesel",
    titleKey: "news.article.diesel_q3.title",
    excerptKey: "news.article.diesel_q3.excerpt",
    dateISO: "2026-05-12",
    readMinutes: 4,
    authorKey: "news.author.market_team",
  },
  {
    id: "etihad-rail",
    category: "industry",
    titleKey: "news.article.etihad_rail.title",
    excerptKey: "news.article.etihad_rail.excerpt",
    dateISO: "2026-05-10",
    readMinutes: 7,
    authorKey: "news.author.insights_team",
  },
  {
    id: "neom-freight",
    category: "policy",
    titleKey: "news.article.neom.title",
    excerptKey: "news.article.neom.excerpt",
    dateISO: "2026-05-08",
    readMinutes: 8,
    authorKey: "news.author.market_team",
  },
  {
    id: "eid-capacity",
    category: "carriers",
    titleKey: "news.article.eid_capacity.title",
    excerptKey: "news.article.eid_capacity.excerpt",
    dateISO: "2026-05-05",
    readMinutes: 5,
    authorKey: "news.author.insights_team",
  },
  {
    id: "cold-chain",
    category: "industry",
    titleKey: "news.article.cold_chain.title",
    excerptKey: "news.article.cold_chain.excerpt",
    dateISO: "2026-05-02",
    readMinutes: 6,
    authorKey: "news.author.ops_desk",
  },
  {
    id: "king-abdullah-port",
    category: "ports",
    titleKey: "news.article.king_abdullah.title",
    excerptKey: "news.article.king_abdullah.excerpt",
    dateISO: "2026-04-28",
    readMinutes: 5,
    authorKey: "news.author.market_team",
  },
  {
    id: "ai-routing",
    category: "tech",
    titleKey: "news.article.ai_routing.title",
    excerptKey: "news.article.ai_routing.excerpt",
    dateISO: "2026-04-25",
    readMinutes: 7,
    authorKey: "news.author.tech_desk",
  },
  {
    id: "oman-uae-corridor",
    category: "policy",
    titleKey: "news.article.oman_uae.title",
    excerptKey: "news.article.oman_uae.excerpt",
    dateISO: "2026-04-22",
    readMinutes: 4,
    authorKey: "news.author.market_team",
  },
  {
    id: "carrier-consolidation",
    category: "carriers",
    titleKey: "news.article.carrier_consolidation.title",
    excerptKey: "news.article.carrier_consolidation.excerpt",
    dateISO: "2026-04-18",
    readMinutes: 6,
    authorKey: "news.author.insights_team",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

/** Format an ISO date string as "May 15, 2026" / "15 مايو 2026" */
export function formatArticleDate(iso: string, lang: "en" | "ar"): string {
  const date = new Date(iso);
  const locale = lang === "ar" ? "ar" : "en-US";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
