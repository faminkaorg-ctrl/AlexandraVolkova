import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

/** One-shot scroll trigger — prevents double fire on refresh / re-enter */
export function revealTrigger(trigger, start = "top 88%") {
  return {
    trigger,
    start,
    once: true,
  };
}

export function showReveals(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.dataset.revealBound = "1";
  });
}

/**
 * Standard fade-up reveal. GSAP owns transform — CSS only hides opacity.
 */
export function bindReveal(selector, options = {}) {
  const {
    y = 40,
    duration = 0.9,
    start = "top 88%",
    ease = "power3.out",
    delay = 0,
    staggerMod = 0,
    staggerDelay = 0,
    indexDelay = false,
    filter,
  } = options;

  if (prefersReducedMotion()) {
    showReveals(selector);
    return;
  }

  gsap.utils.toArray(selector).forEach((el, i) => {
    if (el.dataset.revealBound) return;
    if (filter && !filter(el)) return;

    el.dataset.revealBound = "1";
    gsap.set(el, { opacity: 0, y });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay: indexDelay ? i * staggerDelay : staggerMod ? (i % staggerMod) * staggerDelay : delay,
      ease,
      scrollTrigger: revealTrigger(el, start),
    });
  });
}

/**
 * Reveal a list of elements — sets hidden state immediately (no gsap.from flash).
 */
export function bindRevealEach(targets, options = {}) {
  const {
    y = 40,
    x = 0,
    scale,
    rotateX,
    duration = 0.9,
    start = "top 88%",
    ease = "power3.out",
    stagger = 0,
    delay = 0,
    trigger,
    filter,
    from = {},
    to = {},
  } = options;

  const elements = gsap.utils.toArray(targets);
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.dataset.revealBound = "1";
    });
    return;
  }

  elements.forEach((el, i) => {
    if (el.dataset.revealBound) return;
    if (filter && !filter(el, i)) return;

    el.dataset.revealBound = "1";

    const fromVars = { opacity: 0, y, x, ...from };
    const toVars = { opacity: 1, y: 0, x: 0, ...to };
    if (scale !== undefined) {
      fromVars.scale = scale;
      toVars.scale = 1;
    }
    if (rotateX !== undefined) {
      fromVars.rotateX = rotateX;
      toVars.rotateX = 0;
    }

    gsap.set(el, fromVars);

    gsap.to(el, {
      ...toVars,
      duration,
      delay: delay + i * stagger,
      ease,
      scrollTrigger: revealTrigger(trigger || el, start),
    });
  });
}

/** Defer layout refresh so in-viewport triggers don't fire twice on init */
export function refreshScrollTriggers() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh(true));
  });
}