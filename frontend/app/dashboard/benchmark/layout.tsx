import type { Metadata } from "next";
import { BenchmarkSidebar } from "@/components/dashboard/benchmark/BenchmarkSidebar";
import { SubTabs } from "@/components/dashboard/benchmark/SubTabs";

export const metadata: Metadata = {
  title: "Rate Benchmark — Shenatech",
  robots: { index: false, follow: false },
};

/**
 * Layout for every page under /dashboard/benchmark/*.
 *
 * Renders a full-height left sidebar (BenchmarkSidebar) and the page
 * content area to its right. The page content gets a horizontal
 * sub-tabs row at the top (when the active category has sub-pages).
 *
 * The marketing nav + footer are auto-hidden on /dashboard/* paths.
 * The dashboard top bar (used by other /dashboard/* pages) is hidden
 * specifically on /dashboard/benchmark/* — the sidebar replaces it.
 */
export default function BenchmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bm-app">
      <BenchmarkSidebar />
      <div className="bm-content">
        <SubTabs />
        <div className="bm-content__body">{children}</div>
      </div>
    </div>
  );
}
