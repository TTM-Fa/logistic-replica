import { redirect } from "next/navigation";

/** Marketplace landing → the Home welcome hub. */
export default function MarketplaceIndex() {
  redirect("/dashboard/marketplace/home");
}
