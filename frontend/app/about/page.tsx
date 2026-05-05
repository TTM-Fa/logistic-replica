import type { Metadata } from "next";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About — Shenatech",
  description:
    "Who we are, what we believe, and why we're building a logistics platform for the GCC.",
};

export default function AboutPage() {
  // No top padding — the dark hero handles its own nav clearance, so its
  // dark background extends up behind the transparent nav (same pattern
  // used on /contact and /faq).
  return (
    <main>
      <About />
    </main>
  );
}
