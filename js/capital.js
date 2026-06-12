import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { CAPITAL_DATA } from "../data/content.js";
import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { initStagesFlip } from "./modules/stages-flip.js";
import { initStagePop } from "./modules/stage-pop.js";
import { initScenarioPop } from "./modules/scenario-pop.js";
import { renderScenarios } from "./modules/scenarios-tilt.js";
import { initCapitalScroll } from "./modules/capital-scroll.js";

import { renderSiteFooter } from "./modules/footer.js";
import { renderSubnav } from "./modules/subnav.js";
import { refreshScrollTriggers } from "./modules/reveal.js";
import { prefersReducedMotion } from "./modules/utils.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let environment = null;
let threeScene = null;

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

function renderStages(stages) {
  const timeline = document.getElementById("stages-timeline");
  if (!timeline) return;

  timeline.innerHTML = stages
    .map(
      (s) => `
    <article class="stage-card" data-stage="${s.num}" data-cursor="hover">
      <span class="stage-card__num">Стадия ${String(s.num).padStart(2, "0")}</span>
      <h3 class="stage-card__title">${s.title}</h3>
      <p class="stage-card__hint">Нажмите — откроется описание</p>
    </article>
  `
    )
    .join("");
}

function renderMistakes(mistakes) {
  const grid = document.getElementById("mistakes-grid");
  if (!grid) return;

  grid.innerHTML = mistakes
    .map(
      (m, i) => `
    <article class="typo-block">
      <div class="typo-block__index">${String(i + 1).padStart(2, "0")}</div>
      <h3 class="typo-block__title">${m.title}</h3>
      <p class="typo-block__text">${m.problem}</p>
      <p class="typo-block__text">${m.detail}</p>
      <p class="typo-block__avoid">${m.avoid}</p>
    </article>
  `
    )
    .join("");
}

function renderMyths(myths) {
  const list = document.getElementById("myths-list");
  if (!list) return;

  list.innerHTML = myths
    .map(
      (m) => `
    <article class="myth-item">
      <h3 class="myth-item__myth">${m.myth}</h3>
      <p class="myth-item__reality">${m.reality}</p>
    </article>
  `
    )
    .join("");
}

function initCapitalPage() {
  environment = initCanvasEnvironment();
  renderSiteFooter();
  renderSubnav("capital");
  initCursor();
  initNavigation();

  renderStages(CAPITAL_DATA.stages);
  const stagePop = initStagePop(CAPITAL_DATA.stages);
  initStagesFlip(CAPITAL_DATA.stages, stagePop);

  const scenariosWrap = document.getElementById("scenarios-wrap");
  const scenariosGrid = document.getElementById("scenarios-grid");
  const scenarioPop = initScenarioPop();
  renderScenarios(CAPITAL_DATA.scenarios, scenariosGrid, scenarioPop);

  import("./modules/three-scene.js")
    .then(({ initThreeScene }) => {
      threeScene = initThreeScene(scenariosWrap);
    })
    .catch((err) => {
      console.warn("Three.js scene skipped:", err);
    });

  renderMistakes(CAPITAL_DATA.mistakes);
  renderMyths(CAPITAL_DATA.myths);
  initCapitalScroll();

  gsap.from(".page-hero-capital__inner > *", {
    opacity: 0,
    y: 32,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.2,
  });

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

  refreshScrollTriggers();
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initCapitalPage();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  threeScene?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});