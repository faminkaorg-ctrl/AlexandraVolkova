import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
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

export function initServicesDeep() {
  const deep = document.getElementById("svc-deep");
  if (!deep) return;

  const title = document.getElementById("svc-deep-title");
  const words = splitTitleWords(title);

  if (prefersReducedMotion()) {
    if (words.length) gsap.set(words, { y: 0, opacity: 1 });
    return;
  }

  if (words.length) {
    gsap.set(words, { y: "110%", opacity: 0 });
  }

  const beam = deep.querySelector(".svc-deep__beam");
  if (beam) {
    gsap.to(beam, {
      height: "100%",
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: deep,
        start: "top 70%",
        end: "bottom 20%",
        scrub: 1.2,
      },
    });
  }

  const gateway = document.getElementById("svc-deep-gateway");
  if (gateway && words.length) {
    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: {
        trigger: gateway,
        start: "top 75%",
        once: true,
      },
    });

    gsap.from(["#svc-deep-lead", "#svc-deep-text p", "#svc-deep-text-2"], {
      opacity: 0,
      y: 36,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: gateway,
        start: "top 68%",
        once: true,
      },
    });
  }

  deep.querySelectorAll(".svc-deep__block").forEach((block) => {
    gsap.from(block, {
      opacity: 0,
      y: 64,
      duration: 1,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: block,
        start: "top 86%",
        once: true,
      },
    });
  });

  gsap.from(".svc-compare__card", {
    opacity: 0,
    y: 48,
    scale: 0.94,
    duration: 0.95,
    stagger: 0.12,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: "#svc-compare-grid",
      start: "top 82%",
      once: true,
    },
  });

  gsap.utils.toArray(".svc-card--deep").forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 80,
      duration: 1.1,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true,
      },
    });

    const media = card.querySelector(".svc-card__media img");
    if (media) {
      gsap.to(media, {
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }

    gsap.from(card.querySelectorAll(".svc-step"), {
      opacity: 0,
      x: -24,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: card.querySelector(".svc-card__steps"),
        start: "top 82%",
        once: true,
      },
    });

    gsap.from(card.querySelectorAll(".svc-fact"), {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: card.querySelector(".svc-card__facts"),
        start: "top 88%",
        once: true,
      },
    });
  });

  gsap.from(".svc-faq__item", {
    opacity: 0,
    y: 28,
    duration: 0.75,
    stagger: 0.08,
    ease: "power2.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: "#svc-faq-list",
      start: "top 84%",
      once: true,
    },
  });

  const cta = document.getElementById("svc-deep-cta");
  if (cta) {
    gsap.from(cta.children, {
      opacity: 0,
      y: 32,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: cta,
        start: "top 84%",
        once: true,
      },
    });
  }

  document.querySelectorAll(".svc-compare__card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 6,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 800,
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
    });
  });
}