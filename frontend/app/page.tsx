import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Platform } from "@/components/Platform";
import { Segments } from "@/components/Segments";
import { Partners } from "@/components/Partners";
import { Waitlist } from "@/components/Waitlist";
import { CTA } from "@/components/CTA";

export default function Page() {
  return (
    <>
      <Hero />
      <Problem />
      <Segments />
      <Platform />
      <Waitlist />
      <Partners />
      <CTA />
    </>
  );
}
