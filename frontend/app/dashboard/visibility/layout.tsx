import type { Metadata } from "next";
import { VisibilitySidebar } from "@/components/dashboard/visibility/VisibilitySidebar";
import { VisibilitySubTabs } from "@/components/dashboard/visibility/VisibilitySubTabs";

export const metadata: Metadata = {
  title: "Visibility — Shenatech",
  robots: { index: false, follow: false },
};

/**
 * Layout for every page under /dashboard/visibility/*.
 *
 * Renders a full-height left sidebar (VisibilitySidebar) and the page
 * content area to its right. The content gets a horizontal sub-tabs row
 * at the top (only for sections that have sub-pages).
 *
 * The marketing nav + footer are auto-hidden on /dashboard/* paths, and
 * the dashboard top bar self-suppresses on /dashboard/visibility/* — the
 * sidebar replaces it. Reuses the benchmark `bm-app` shell classes.
 */
export default function VisibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bm-app">
      <VisibilitySidebar />
      <div className="bm-content">
        <VisibilitySubTabs />
        <div className="bm-content__body">{children}</div>
      </div>
    </div>
  );
}
