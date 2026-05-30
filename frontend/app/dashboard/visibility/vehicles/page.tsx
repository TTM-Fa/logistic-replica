import { redirect } from "next/navigation";

/** Parent route redirects to the first sub-page so the sub-tabs row activates. */
export default function VehiclesIndex() {
  redirect("/dashboard/visibility/vehicles/dedicated");
}
