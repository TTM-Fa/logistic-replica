import { DashboardHub } from "@/components/dashboard/DashboardHub";

/**
 * Main dashboard hub at /dashboard.
 *
 * For now this route is publicly reachable so we can preview it without
 * a backend. Once the auth layer lands we'll add a server-side check
 * here that redirects unauthenticated users to /signin.
 */
export default function DashboardPage() {
  return <DashboardHub />;
}
