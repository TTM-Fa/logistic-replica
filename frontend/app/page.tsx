import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Platform } from "@/components/Platform";
import { Segments } from "@/components/Segments";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Effects } from "./effects";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Problem />
      <Platform />
      <Segments />
      <Partners />
      <CTA />
      <Footer />
      <Effects />
    </>
  );
}
