"use client";

import { T } from "@/lib/T";

/**
 * Rate Benchmark — landing page (Phase 1 stub).
 *
 * Shown when the user lands on /dashboard/benchmark before picking a
 * category. Once the categories are fleshed out we may auto-redirect to
 * the most relevant one (e.g. Rates → Overview) instead of showing this.
 */
export default function BenchmarkLanding() {
  return (
    <div className="bm-landing">
      <p className="bm-landing__eyebrow">
        <T id="benchmark.landing.eyebrow" />
      </p>
      <h1 className="bm-landing__title">
        <T id="benchmark.landing.title" />
      </h1>
      <p className="bm-landing__sub">
        <T id="benchmark.landing.sub" />
      </p>
    </div>
  );
}
