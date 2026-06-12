import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { REVIEWS_DATA } from "../data/content.js";
import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { renderReviewsGrid } from "./modules/reviews-render.js";
import { renderSubnav } from "./modules/subnav.js";
import { initMultiStepForm } from "./modules/multi-step-form.js";
import { renderContactChannels } from "./modules/contact-channels.js";
import { renderSiteFooter } from "./modules/footer.js";
import { bindReveal, refreshScrollTriggers } from "./modules/reveal.js";
import { prefersReducedMotion } from "./modules/utils.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let environment = null;

function initLenis() {
  if (prefersReducedMotion()) return null;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initRipple() {
  document.querySelectorAll(".btn-cta").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-cta__ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

function initReviewsPage() {
  environment = initCanvasEnvironment();
  renderSiteFooter();
  renderSubnav("reviews");
  initCursor();
  initNavigation();

  renderReviewsGrid(REVIEWS_DATA.reviews);
  renderContactChannels();
  initMultiStepForm(REVIEWS_DATA.stages, REVIEWS_DATA.services);
  initRipple();

  bindReveal(".reveal-reviews:not(.yt-review)", {
    y: 36,
    duration: 0.85,
    start: "top 88%",
  });

  gsap.from(".page-hero-reviews .page-hero-capital__inner > *", {
    opacity: 0,
    y: 28,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.15,
  });

  refreshScrollTriggers();
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initReviewsPage();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});