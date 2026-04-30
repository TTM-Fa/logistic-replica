import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ — Shenatech",
  description:
    "Common questions about Shenatech — integration, coverage, pricing, security, pilots, and more.",
};

export default function FaqPage() {
  // Add top padding so the section clears the fixed nav bar.
  return (
    <main style={{ paddingTop: "var(--nav-h, 64px)" }}>
      <FAQ />
    </main>
  );
}
