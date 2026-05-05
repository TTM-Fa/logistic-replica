import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Shenatech",
  description:
    "Get in touch with Shenatech — email, phone numbers, and how to reach our team.",
};

export default function ContactPage() {
  // No top padding here — the dark contact hero extends up behind the nav so
  // the transparent nav shows the dark hero color through it (same pattern
  // as the homepage Hero, which handles its own nav clearance internally).
  return (
    <main>
      <Contact />
    </main>
  );
}
