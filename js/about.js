import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { ABOUT_DATA } from "../data/content.js";
import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { initDualScroll } from "./modules/dual-scroll.js";
import { renderTerminalTable } from "./modules/terminal-table.js";
import { initLightboxSpring, renderDiplomas } from "./modules/lightbox-spring.js";
import { renderSiteFooter } from "./modules/footer.js";
import { renderSubnav } from "./modules/subnav.js";
import { initAboutDeep } from "./modules/about-deep.js";
import { refreshScrollTriggers } from "./modules/reveal.js";
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

function renderJourney(journey) {
  const container = document.getElementById("journey-steps");
  if (!container) return;

  container.innerHTML = journey
    .map(
      (j) => `
    <article class="journey-step" data-era="${j.era}">
      <span class="journey-step__era">Этап ${j.era}</span>
      <span class="journey-step__label">${j.label}</span>
      <h3 class="journey-step__title">${j.title}</h3>
      <p class="journey-step__desc">${j.desc}</p>
      <span class="journey-step__tag">${j.tag}</span>
    </article>
  `
    )
    .join("");
}

function renderDeepIntro(deep) {
  const label = document.getElementById("deep-label");
  const title = document.getElementById("deep-title");
  const lead = document.getElementById("deep-lead");
  const text = document.getElementById("deep-text");
  const text2 = document.getElementById("deep-text-2");

  if (label) label.textContent = deep.label;
  if (title) title.textContent = deep.title;
  if (lead) lead.textContent = deep.lead;
  if (text) text.textContent = deep.text;
  if (text2) text2.textContent = deep.text2;
}

function renderStats(stats) {
  const grid = document.getElementById("about-stats-grid");
  if (!grid) return;

  grid.innerHTML = stats
    .map(
      (s) => `
    <article class="about-stat">
      <div class="about-stat__value">
        <span data-count="${s.value}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix || ""}">${s.prefix || ""}0${s.suffix || ""}</span>
      </div>
      <p class="about-stat__label">${s.label}</p>
      <p class="about-stat__desc">${s.desc}</p>
    </article>
  `
    )
    .join("");
}

function renderCredCards(credentials) {
  const grid = document.getElementById("cred-cards");
  if (!grid) return;

  grid.innerHTML = credentials
    .map(
      (c) => `
    <article class="cred-card" data-cursor="hover">
      <p class="cred-card__code">${c.code}</p>
      <p class="cred-card__area">${c.area}</p>
      <p class="cred-card__apply">${c.apply}</p>
      <p class="cred-card__detail">${c.detail}</p>
    </article>
  `
    )
    .join("");
}

function renderPhilosophy(philosophy) {
  const title = document.getElementById("philosophy-title");
  const lead = document.getElementById("philosophy-lead");
  const grid = document.getElementById("philosophy-grid");

  if (title) title.textContent = philosophy.title;
  if (lead) lead.textContent = philosophy.lead;
  if (!grid) return;

  grid.innerHTML = philosophy.pillars
    .map(
      (p) => `
    <article class="philosophy-pillar">
      <span class="philosophy-pillar__num">${p.num}</span>
      <h3 class="philosophy-pillar__title">${p.title}</h3>
      <p class="philosophy-pillar__text">${p.text}</p>
    </article>
  `
    )
    .join("");
}

function renderManifesto(manifesto) {
  const intro = document.getElementById("manifesto-intro");
  const notList = document.getElementById("manifesto-not");
  const yesList = document.getElementById("manifesto-yes");

  if (intro && manifesto.intro) intro.textContent = manifesto.intro;

  const itemHtml = (item) => {
    if (typeof item === "string") return `<li>${item}</li>`;
    return `<li><strong>${item.title}</strong><span>${item.text}</span></li>`;
  };

  if (notList) notList.innerHTML = manifesto.not.map(itemHtml).join("");
  if (yesList) yesList.innerHTML = manifesto.yes.map(itemHtml).join("");
}

function renderAudience(audience) {
  const intro = document.getElementById("audience-intro");
  const forList = document.getElementById("audience-for");
  const notList = document.getElementById("audience-not");

  if (intro && audience.intro) intro.textContent = audience.intro;

  const itemHtml = (item) => {
    if (typeof item === "string") return `<li>${item}</li>`;
    return `<li><strong>${item.title}</strong><span>${item.text}</span></li>`;
  };

  if (forList) forList.innerHTML = audience.for.map(itemHtml).join("");
  if (notList) notList.innerHTML = audience.notFor.map(itemHtml).join("");
}

function renderCta(cta) {
  const title = document.getElementById("cta-title");
  const lead = document.getElementById("cta-lead");
  const text = document.getElementById("cta-text");
  const channels = document.getElementById("cta-channels");

  if (title) title.textContent = cta.title;
  if (lead) lead.textContent = cta.lead;
  if (text) text.textContent = cta.text;
  if (channels) channels.textContent = cta.channels;
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

function initAboutPage() {
  environment = initCanvasEnvironment();
  renderSiteFooter();
  renderSubnav("about");
  initCursor();
  initNavigation();

  const intro = ABOUT_DATA.intro;
  const introTitle = document.getElementById("dual-intro-title");
  const introText = document.getElementById("dual-intro-text");
  if (introTitle) introTitle.textContent = intro.title;
  if (introText) introText.textContent = intro.text;

  renderJourney(ABOUT_DATA.journey);

  renderDeepIntro(ABOUT_DATA.deep);
  renderStats(ABOUT_DATA.stats);
  renderTerminalTable(ABOUT_DATA.credentials);
  renderCredCards(ABOUT_DATA.credentials);
  renderPhilosophy(ABOUT_DATA.philosophy);
  renderDiplomas(ABOUT_DATA.diplomas);
  initLightboxSpring(ABOUT_DATA.diplomas);
  renderManifesto(ABOUT_DATA.manifesto);
  renderAudience(ABOUT_DATA.audience);
  renderCta(ABOUT_DATA.cta);

  initAboutDeep();
  initRipple();

  const heroItems = gsap.utils.toArray(".page-hero-about__inner > *");
  gsap.set(heroItems, { opacity: 0, y: 28 });
  gsap.to(heroItems, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.15,
  });

  initDualScroll();
  window.addEventListener("load", () => refreshScrollTriggers(), { once: true });
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initAboutPage();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});