import type { Metadata } from "next";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";

export const metadata: Metadata = {
  title: "Dashboard — Shenatech",
  description: "Your Shenatech workspace.",
  // Don't show the dashboard in Google results — it's a members area, not
  // marketing content.
  robots: { index: false, follow: false },
};

/**
 * Nested layout for every /dashboard/* page. Provides a compact top bar
 * and reserves the full page for the dashboard content. The public
 * marketing <Nav /> and <Footer /> components are automatically hidden
 * on /dashboard/* paths (they check the pathname and return null).
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-shell">
      <DashboardTopBar />
      {children}
    </div>
  );
}
