"use client";

import Link from "next/link";

/**
 * DesignsGallery — index page that lists all the dashboard hub variants
 * the user can choose from. Each card links to a full-page version of
 * that variant. Helpful for side-by-side comparison.
 */

const VARIANTS: {
  key: "v1" | "v2" | "v3" | "v4";
  name: string;
  vibe: string;
  desc: string;
  // A simple gradient palette for the preview thumb so each card reads visually distinct
  preview: string;
}[] = [
  {
    key: "v1",
    name: "Spotlight",
    vibe: "Light · Bright SaaS",
    desc: "Hero welcome banner, 3 models in a horizontal row, KPI strip, recent activity feed.",
    preview:
      "linear-gradient(135deg, #FFF8E1 0%, #FCBA02 100%)",
  },
  {
    key: "v2",
    name: "Bento",
    vibe: "Dark · Modern asymmetric",
    desc: "Bento-style grid mixing the 3 models with stat tiles and quick actions on a dark canvas.",
    preview:
      "linear-gradient(135deg, #0B0D0F 0%, #1A1D22 60%, #FCBA02 110%)",
  },
  {
    key: "v3",
    name: "Operator's Desk",
    vibe: "Workspace · Data-dense",
    desc: "KPI band on top, models as pills, mock 'Recent Shipments' table, notifications panel.",
    preview:
      "linear-gradient(135deg, #F6F5F1 0%, #FFFFFF 70%, rgba(252,186,2,0.20) 100%)",
  },
  {
    key: "v4",
    name: "Magazine",
    vibe: "Editorial · Premium",
    desc: "Big featured banner using the visibility map, models in a strip, top-carriers leaderboard.",
    preview:
      "linear-gradient(135deg, #292415 0%, #0B0D0F 50%, #FCBA02 130%)",
  },
];

export function DesignsGallery() {
  return (
    <main className="dash-main">
      <div className="dash-designs-intro">
        <p className="eyebrow" style={{ marginBottom: "0.85rem" }}>
          DASHBOARD CONCEPTS
        </p>
        <h1 className="dash-designs-intro__heading">
          Pick the dashboard you like best.
        </h1>
        <p className="dash-designs-intro__sub">
          Four directions for the main dashboard hub. All four keep the three
          models — Visibility, Marketplace, Rate Benchmark — front and centre,
          but each surrounds them with a different mix of content and layout.
          Open each in its own tab and we'll iterate from your favourite.
        </p>
      </div>

      <div className="dash-designs-grid">
        {VARIANTS.map((v) => (
          <Link
            key={v.key}
            href={`/dashboard/designs/${v.key}`}
            className="dash-design-card"
          >
            <div
              className="dash-design-card__preview"
              style={{ background: v.preview }}
              aria-hidden="true"
            >
              <span className="dash-design-card__preview-label">{v.key.toUpperCase()}</span>
            </div>
            <div className="dash-design-card__body">
              <span className="dash-design-card__vibe">{v.vibe}</span>
              <h3 className="dash-design-card__name">{v.name}</h3>
              <p className="dash-design-card__desc">{v.desc}</p>
              <span className="dash-design-card__cta">
                View design
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
