import type { Metadata } from "next";
import { MarketplaceSidebar } from "@/components/dashboard/marketplace/MarketplaceSidebar";

export const metadata: Metadata = {
  title: "Marketplace — Shenatech",
  robots: { index: false, follow: false },
};

/**
 * Layout for every page under /dashboard/marketplace/*.
 *
 * Full-height left sidebar + content area. No sub-tabs row (all
 * Marketplace sections are flat). The marketing nav/footer are auto-hidden
 * on /dashboard/* and the dashboard top bar self-suppresses on
 * /dashboard/marketplace/*. Reuses the benchmark `bm-app` shell classes.
 */
export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bm-app">
      <MarketplaceSidebar />
      <div className="bm-content">
        <div className="bm-content__body">{children}</div>
      </div>
    </div>
  );
}
