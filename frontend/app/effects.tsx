"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * All scroll-driven page effects:
 * - scroll progress bar width
 * - `.reveal` fade-up via IntersectionObserver
 * - GSAP ScrollTrigger stagger reveals for cards/paragraphs/sections
 * - Smooth scroll for in-page anchor links
 * - Hero mouse parallax (atmosphere blobs)
 *
 * `pathname` is a dependency so the effect re-runs on client-side navigation —
 * otherwise observers/ScrollTriggers set up on page A would never observe
 * elements on page B, and `.reveal` elements would stay invisible until refresh.
 */
export function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const progress = document.querySelector<HTMLElement>(".scroll-progress");

    // ── Scroll progress bar ──
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── IntersectionObserver for .reveal ──
    let io: IntersectionObserver | null = null;
    if (!noMotion) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
      );
      document.querySelectorAll(".reveal").forEach((el) => io!.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }

    // ── Hero mouse parallax ──
    const hero = document.querySelector<HTMLElement>(".hero");
    const onHeroMove = (e: MouseEvent) => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hero.style.setProperty("--mx", mx.toFixed(3));
      hero.style.setProperty("--my", my.toFixed(3));
    };
    const onHeroLeave = () => {
      if (!hero) return;
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };
    if (hero && !noMotion && pointerFine) {
      hero.addEventListener("mousemove", onHeroMove);
      hero.addEventListener("mouseleave", onHeroLeave);
    }

    // ── Subtle 2px lift on hover for capability (.offering) & segment cards ──
    // Same feel as the "Request a Demo" button's translateY(-2px) on :hover —
    // the card rises slightly to signal it's interactive. Uses GSAP so it
    // plays nicely with the existing reveal animation.
    const hoverCleanups: Array<() => void> = [];
    if (!noMotion && pointerFine) {
      [".offering", ".segment"].forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          const onEnter = () => {
            gsap.to(el, { y: -2, duration: 0.2, ease: "power2.out" });
          };
          const onLeave = () => {
            gsap.to(el, { y: 0, duration: 0.25, ease: "power2.out" });
          };
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          hoverCleanups.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          });
        });
      });
    }

    // ── GSAP ScrollTrigger choreography ──
    let ctxAll: ReturnType<typeof gsap.context> | null = null;
    if (!noMotion) {
      gsap.registerPlugin(ScrollTrigger);
      ctxAll = gsap.context(() => {
        const EASE = "power3.out";
        gsap.fromTo(
          ".offering",
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 1.0,
            ease: EASE,
            scrollTrigger: { trigger: ".offerings", start: "top 78%", once: true },
          },
        );
        gsap.fromTo(
          ".segment",
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.07,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: ".segments__grid", start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          ".problem__body p",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            duration: 0.9,
            ease: EASE,
            scrollTrigger: { trigger: ".problem__body", start: "top 78%", once: true },
          },
        );
        gsap.fromTo(
          ".problem__aside > *:not(.gold-line)",
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: ".problem__aside", start: "top 85%", once: true },
          },
        );
        [".platform__intro", ".segments__header"].forEach((sel) => {
          gsap.fromTo(
            `${sel} > *`,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: sel, start: "top 82%", once: true },
            },
          );
        });
        gsap.fromTo(
          ".partners__header > *:not(.gold-line)",
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: ".partners__header", start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          ".cta-section .container > *:not(.gold-line)",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: EASE,
            scrollTrigger: { trigger: ".cta-section", start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          ".partners__ticker",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.2,
            ease: EASE,
            scrollTrigger: { trigger: ".partners__ticker", start: "top 90%", once: true },
          },
        );
      });
    }

    // ── Smooth scroll for in-page anchors ──
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const onAnchorClick = (e: Event) => {
      const el = e.currentTarget as HTMLAnchorElement;
      const href = el.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      const nav = document.querySelector<HTMLElement>(".nav");
      const navH = nav?.offsetHeight ?? 64;
      const y = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top: y, behavior: noMotion ? "auto" : "smooth" });
    };
    links.forEach((l) => l.addEventListener("click", onAnchorClick));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hero) {
        hero.removeEventListener("mousemove", onHeroMove);
        hero.removeEventListener("mouseleave", onHeroLeave);
      }
      io?.disconnect();
      ctxAll?.revert();
      links.forEach((l) => l.removeEventListener("click", onAnchorClick));
      hoverCleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
