import { redirect } from "next/navigation";

/** Visibility landing → the Dashboards board (first section in the nav). */
export default function VisibilityIndex() {
  redirect("/dashboard/visibility/dashboards");
}
