import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { initHero } from "./modules/hero.js";
import { initMarquee } from "./modules/marquee.js";
import { renderHomeSections } from "./modules/home-render.js";
import { renderSiteFooter } from "./modules/footer.js";
import { renderSubnav } from "./modules/subnav.js";
import { initHomeScroll } from "./modules/home-scroll.js";
import { refreshScrollTriggers } from "./modules/reveal.js";
import { prefersReducedMotion } from "./modules/utils.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let environment = null;

function initLenis() {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initApp() {
  environment = initCanvasEnvironment();
  renderHomeSections();
  renderSiteFooter();
  renderSubnav("home");
  initCursor();
  initNavigation();
  initHero(lenis);
  initMarquee(lenis);
  initHomeScroll();

  refreshScrollTriggers();
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initApp();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});