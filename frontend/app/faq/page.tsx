import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ — Shenatech",
  description:
    "Common questions about Shenatech — integration, coverage, pricing, security, pilots, and more.",
};

export default function FaqPage() {
  // No top padding — the dark FAQ hero handles its own nav clearance, so its
  // dark background extends up behind the transparent nav.
  return (
    <main>
      <FAQ />
    </main>
  );
}
