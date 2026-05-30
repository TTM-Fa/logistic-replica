"use client";

import { T } from "@/lib/T";

/**
 * BenchmarkPagePlaceholder — shared "Coming soon" body used by every
 * Phase 1 stub page in the benchmark dashboard.
 *
 * Takes two translation keys: a category label and a sub-page label
 * (sub-page is optional for pages that don't have sub-tabs). Renders a
 * centered card with breadcrumb-style text + a gold pulsing badge.
 */
export function BenchmarkPagePlaceholder({
  categoryKey,
  subKey,
}: {
  categoryKey: string;
  /** Optional — pass when this page sits inside a category with sub-tabs */
  subKey?: string;
}) {
  return (
    <div className="bm-placeholder">
      <div className="bm-placeholder__crumb">
        <T id={categoryKey} />
        {subKey ? (
          <>
            <span aria-hidden="true"> / </span>
            <T id={subKey} />
          </>
        ) : null}
      </div>
      <h1 className="bm-placeholder__title">
        <T id="benchmark.placeholder.title" />
      </h1>
      <p className="bm-placeholder__sub">
        <T id="benchmark.placeholder.sub" />
      </p>
    </div>
  );
}
