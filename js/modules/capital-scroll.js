import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { bindReveal, showReveals } from "./reveal.js";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export function initCapitalScroll() {
  if (prefersReducedMotion()) {
    showReveals(".typo-block, .myth-item, .reveal-capital");
    return;
  }

  bindReveal(".reveal-capital", { y: 40, duration: 1, start: "top 85%" });
  bindReveal(".typo-block", {
    y: 40,
    duration: 0.9,
    start: "top 88%",
    staggerMod: 2,
    staggerDelay: 0.1,
  });
  bindReveal(".myth-item", {
    y: 32,
    duration: 0.85,
    ease: "power2.out",
    start: "top 90%",
    staggerDelay: 0.08,
    indexDelay: true,
  });
}