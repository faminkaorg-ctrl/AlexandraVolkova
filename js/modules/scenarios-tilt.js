import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { clamp, prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  shield: `<path class="icon-path" d="M24 4L6 10v10c0 11 8 18 18 20 10-2 18-9 18-20V10L24 4z"/>`,
  layers: `<path class="icon-path" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
  trend: `<path class="icon-path" d="M4 20L16 8l6 6 8-12"/><path class="icon-path" d="M20 4h4v4"/>`,
  flow: `<path class="icon-path" d="M4 12h32M28 6l8 6-8 6M12 18l-8-6 8-6"/>`,
  orbit: `<circle class="icon-path" cx="24" cy="24" r="8"/><path class="icon-path" d="M24 4v4M24 40v4M4 24h4M40 24h4"/>`,
};

export function renderScenarios(scenarios, container, scenarioPop) {
  if (!container) return;

  container.innerHTML = scenarios
    .map(
      (s) => `
    <article class="scenario-card scenario-card--${s.accent}" data-tilt data-scenario="${s.num}" role="button" tabindex="0" data-cursor="hover" aria-label="${s.title} — открыть описание">
      <div class="scenario-card__inner">
        <div class="scenario-card__shine"></div>
        <div class="scenario-card__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48">${ICONS[s.icon] || ICONS.shield}</svg>
        </div>
        <p class="scenario-card__num">${s.num}</p>
        <h3 class="scenario-card__title">${s.title}</h3>
        <p class="scenario-card__desc">${s.desc}</p>
        <p class="scenario-card__meta"><strong>Для кого:</strong> ${s.forWhom}</p>
        <p class="scenario-card__hint">Нажмите — подробнее</p>
      </div>
    </article>
  `
    )
    .join("");

  const activateCard = (card) => {
    const num = card.dataset.scenario;
    const scenario = scenarios.find((s) => String(s.num) === String(num));
    if (!scenario) return;

    container.querySelectorAll(".scenario-card").forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");
    scenarioPop?.open(scenario);
  };

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".scenario-card");
    if (!card || !container.contains(card)) return;
    activateCard(card);
  });

  container.addEventListener("keydown", (e) => {
    const card = e.target.closest(".scenario-card");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateCard(card);
    }
  });

  initTilt(container.querySelectorAll("[data-tilt]"));
  initDrawIcons(container);
}

function initTilt(cards) {
  if (prefersReducedMotion()) return;

  cards.forEach((card) => {
    const inner = card.querySelector(".scenario-card__inner");
    const shine = card.querySelector(".scenario-card__shine");
    let bounds = null;

    const onMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width / 2;
      const cy = bounds.height / 2;
      const rotateX = clamp((y - cy) / cy, -1, 1) * -10;
      const rotateY = clamp((x - cx) / cx, -1, 1) * 10;

      gsap.to(inner, {
        rotateX,
        rotateY,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });

      if (shine) {
        shine.style.setProperty("--shine-x", `${(x / bounds.width) * 100}%`);
        shine.style.setProperty("--shine-y", `${(y / bounds.height) * 100}%`);
      }
      card.classList.add("is-hover");
    };

    const onLeave = () => {
      bounds = null;
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.6)",
      });
      card.classList.remove("is-hover");
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });
}

function initDrawIcons(container) {
  const cards = container.querySelectorAll(".scenario-card");
  ScrollTrigger.batch(cards, {
    start: "top 88%",
    once: true,
    onEnter: (batch) => {
      batch.forEach((card) => card.classList.add("is-drawn"));
    },
  });
}