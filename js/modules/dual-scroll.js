import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export function initDualScroll() {
  const section = document.getElementById("dual-scroll");
  const visualWrap = document.querySelector(".dual-scroll__visual-wrap");
  const visual = document.getElementById("dual-visual");
  const progress = document.getElementById("dual-progress");
  const steps = document.querySelectorAll(".journey-step");

  if (!section || !visualWrap || !visual || !steps.length) return;

  if (prefersReducedMotion() || window.innerWidth < 1024) {
    steps.forEach((s) => s.classList.add("is-active"));
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${steps.length * window.innerHeight * 0.5}`,
    pin: visualWrap,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  let activeIndex = -1;

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) activateStep(index);
      },
    });
  });

  function activateStep(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
    });

    const pct = ((index + 1) / steps.length) * 100;
    if (progress) {
      gsap.to(progress, { height: `${pct}%`, duration: 0.5, ease: "power2.out" });
    }

    gsap.to(visual, {
      scale: 1 - index * 0.02,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  activateStep(0);
}