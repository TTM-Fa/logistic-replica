"use client";

import { T } from "@/lib/T";

/**
 * VisibilityPagePlaceholder — shared "Coming soon" body used by every
 * Phase 1 stub page in the Visibility dashboard.
 *
 * Takes a section label key and an optional sub-page label key. Renders a
 * centered card with breadcrumb-style text + a gold pulsing badge. Reuses
 * the theme-aware `bm-placeholder` CSS from the benchmark module.
 */
export function VisibilityPagePlaceholder({
  sectionKey,
  subKey,
}: {
  sectionKey: string;
  /** Optional — pass when this page sits inside a section with sub-tabs */
  subKey?: string;
}) {
  return (
    <div className="bm-placeholder">
      <div className="bm-placeholder__crumb">
        <T id={sectionKey} />
        {subKey ? (
          <>
            <span aria-hidden="true"> / </span>
            <T id={subKey} />
          </>
        ) : null}
      </div>
      <h1 className="bm-placeholder__title">
        <T id="visibility.placeholder.title" />
      </h1>
      <p className="bm-placeholder__sub">
        <T id="visibility.placeholder.sub" />
      </p>
    </div>
  );
}
