import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { bindReveal, showReveals } from "./reveal.js";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export function initHomeScroll() {
  const stickyCta = document.getElementById("sticky-cta");
  const hero = document.getElementById("hero");

  if (prefersReducedMotion()) {
    showReveals(".reveal-home");
    stickyCta?.classList.add("is-visible");
    return;
  }

  bindReveal(".reveal-home", {
    y: 40,
    duration: 1,
    start: "top 88%",
    staggerMod: 3,
    staggerDelay: 0.06,
  });

  document.querySelectorAll(".home-svc-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { y: -8, duration: 0.45, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, duration: 0.55, ease: "power3.out" });
    });
  });

  if (stickyCta && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      onEnter: () => stickyCta.classList.add("is-visible"),
      onLeaveBack: () => stickyCta.classList.remove("is-visible"),
    });
  }

  const showcaseVisual = document.querySelector(".home-showcase__visual");
  if (showcaseVisual) {
    gsap.to(showcaseVisual, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: showcaseVisual,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }
}