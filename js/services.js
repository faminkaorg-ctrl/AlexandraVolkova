import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { renderServicesPage } from "./modules/services-render.js";
import { initServicesCinematic } from "./modules/services-cinematic.js";
import { renderSiteFooter } from "./modules/footer.js";
import { renderSubnav } from "./modules/subnav.js";
import { refreshScrollTriggers } from "./modules/reveal.js";
import { prefersReducedMotion } from "./modules/utils.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let environment = null;

function initLenis() {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

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

function initServicesPageApp() {
  environment = initCanvasEnvironment();
  renderSiteFooter();
  renderSubnav("services");
  initCursor();
  initNavigation();
  renderServicesPage();
  initServicesCinematic();
  initRipple();

  refreshScrollTriggers();
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initServicesPageApp();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});