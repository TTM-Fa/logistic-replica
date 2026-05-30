"use client";

import { T } from "@/lib/T";

/**
 * MarketplacePagePlaceholder — shared "coming soon" body for every Phase 1
 * stub page in the Marketplace dashboard. Reuses the theme-aware
 * `bm-placeholder` CSS from the benchmark module.
 */
export function MarketplacePagePlaceholder({ sectionKey }: { sectionKey: string }) {
  return (
    <div className="bm-placeholder">
      <div className="bm-placeholder__crumb">
        <T id={sectionKey} />
      </div>
      <h1 className="bm-placeholder__title">
        <T id="marketplace.placeholder.title" />
      </h1>
      <p className="bm-placeholder__sub">
        <T id="marketplace.placeholder.sub" />
      </p>
    </div>
  );
}
