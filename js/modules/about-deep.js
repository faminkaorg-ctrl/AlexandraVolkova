import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { bindRevealEach, revealTrigger } from "./reveal.js";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

function splitTitleWords(el) {
  if (!el) return [];
  const text = el.textContent.trim();
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="word">${w}</span>`)
    .join(" ");
  return el.querySelectorAll(".word");
}

function animateCounters(stats) {
  stats.forEach((stat) => {
    const valueEl = stat.querySelector("[data-count]");
    if (!valueEl || valueEl.dataset.countBound) return;

    valueEl.dataset.countBound = "1";
    const target = parseFloat(valueEl.dataset.count);
    const prefix = valueEl.dataset.prefix || "";
    const suffix = valueEl.dataset.suffix || "";
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: revealTrigger(stat, "top 82%"),
      onUpdate: () => {
        valueEl.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
      },
    });
  });
}

export function initAboutDeep() {
  const deep = document.getElementById("about-deep");
  if (!deep) return;

  const beam = deep.querySelector(".about-deep__beam");
  const gateway = document.getElementById("about-deep-gateway");
  const title = document.getElementById("deep-title");
  const words = splitTitleWords(title);
  const gatewayCopy = gateway
    ? gateway.querySelectorAll("#deep-lead, #deep-text p, #deep-text-2")
    : [];

  if (prefersReducedMotion()) {
    if (words.length) gsap.set(words, { y: 0, opacity: 1 });
    gsap.set(gatewayCopy, { opacity: 1, y: 0 });
    return;
  }

  if (words.length) {
    gsap.set(words, { y: "110%", opacity: 0 });
  }

  if (gatewayCopy.length) {
    gsap.set(gatewayCopy, { opacity: 0, y: 40 });
  }

  if (beam) {
    gsap.to(beam, {
      height: "100%",
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: deep,
        start: "top 70%",
        end: "bottom 20%",
        scrub: 1.2,
      },
    });
  }

  if (gateway && words.length) {
    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: revealTrigger(gateway, "top 75%"),
    });

    bindRevealEach(gatewayCopy, {
      y: 40,
      duration: 1,
      stagger: 0.15,
      start: "top 68%",
      trigger: gateway,
    });
  }

  gsap.utils.toArray(".about-deep__head").forEach((head) => {
    bindRevealEach(head.children, {
      y: 36,
      duration: 0.9,
      stagger: 0.1,
      start: "top 84%",
      trigger: head,
    });
  });

  animateCounters(deep.querySelectorAll(".about-stat"));

  bindRevealEach(".cred-card", {
    y: 80,
    rotateX: 12,
    duration: 1,
    stagger: 0.12,
    start: "top 80%",
    trigger: "#cred-cards",
  });

  bindRevealEach(".philosophy-pillar", {
    y: 60,
    scale: 0.92,
    duration: 1,
    stagger: 0.14,
    start: "top 78%",
    trigger: "#philosophy-grid",
  });

  bindRevealEach(".diplomas--deep .diploma-card", {
    y: 40,
    scale: 0.85,
    duration: 0.9,
    stagger: 0.1,
    ease: "back.out(1.2)",
    start: "top 80%",
    trigger: ".diplomas--deep",
  });

  gsap.utils.toArray(".about-manifesto--deep li").forEach((li, i) => {
    if (li.dataset.revealBound) return;
    li.dataset.revealBound = "1";

    const fromX = i % 2 === 0 ? -32 : 32;
    gsap.set(li, { opacity: 0, x: fromX, clipPath: "inset(0 100% 0 0)" });

    gsap.to(li, {
      opacity: 1,
      x: 0,
      clipPath: "inset(0 0% 0 0)",
      duration: 0.85,
      delay: (i % 5) * 0.05,
      ease: "power3.out",
      scrollTrigger: revealTrigger(li, "top 92%"),
    });
  });

  gsap.utils.toArray(".audience-grid--deep li").forEach((li, i) => {
    if (li.dataset.revealBound) return;
    li.dataset.revealBound = "1";
    gsap.set(li, { opacity: 0, y: 28 });
    gsap.to(li, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      delay: (i % 4) * 0.06,
      ease: "power2.out",
      scrollTrigger: revealTrigger(li, "top 94%"),
    });
  });

  const cta = document.getElementById("about-deep-cta");
  if (cta) {
    bindRevealEach(cta.children, {
      y: 36,
      duration: 1,
      stagger: 0.12,
      start: "top 82%",
      trigger: cta,
    });

    gsap.to(cta, {
      boxShadow: "0 40px 100px rgba(0,0,0,0.45), 0 0 120px rgba(212,175,55,0.18)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: revealTrigger(cta, "top 80%"),
    });
  }

  document.querySelectorAll(".cred-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 900,
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
    });
  });
}