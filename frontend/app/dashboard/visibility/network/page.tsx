import { redirect } from "next/navigation";

/** Parent route redirects to the first sub-page so the sub-tabs row activates. */
export default function NetworkIndex() {
  redirect("/dashboard/visibility/network/carriers");
}
