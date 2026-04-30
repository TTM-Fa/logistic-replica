import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Shenatech",
  description:
    "Get in touch with Shenatech — email, phone numbers, and how to reach our team.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "var(--nav-h, 64px)" }}>
      <Contact />
    </main>
  );
}
