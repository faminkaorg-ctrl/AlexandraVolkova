import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export function initServicesCinematic() {
  const reduced = prefersReducedMotion();

  if (reduced) {
    document.body.classList.add("svc-ready");
    document.querySelectorAll(".svc-stage__step").forEach((s) => s.classList.add("is-active"));
    initHorizontalStage();
    document.querySelectorAll(".svc-act").forEach((a) => a.classList.add("is-revealed"));
    return;
  }

  initHeroIntro();
  initHeroParallax();
  initGateway();
  initTheater();
  initMatrix();
  initFaq();
  initCta();

  waitForImages(".svc-cine-hero img, .svc-stage__slide-bg img").then(() => {
    requestAnimationFrame(() => {
      initHorizontalStage();
      ScrollTrigger.refresh(true);
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(true));
}

function waitForImages(selector) {
  const images = [...document.querySelectorAll(selector)];
  if (!images.length) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
    )
  );
}

function initHeroIntro() {
  const hero = document.querySelector(".svc-cine-hero");
  if (!hero) return;

  const titleLines = hero.querySelectorAll(".svc-cine-hero__title-line");
  const cards = hero.querySelectorAll(".svc-cine-hero__card");

  gsap.set(".svc-cine-hero__label", { opacity: 0, y: 16 });
  gsap.set(titleLines, { opacity: 0, y: 28 });
  gsap.set(".svc-cine-hero__sub", { opacity: 0, y: 20 });
  gsap.set(".svc-cine-hero__scroll, .svc-cine-hero__ticker", { opacity: 0 });
  gsap.set(".svc-cine-hero__stat", { opacity: 0, y: 12 });
  gsap.set(cards, { opacity: 0, y: 40 });

  const tl = gsap.timeline({
    defaults: { ease: "power4.out" },
    onComplete: () => document.body.classList.add("svc-ready"),
  });

  tl.fromTo(".svc-cine-hero__bg", { scale: 1.06 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
    .to(".svc-cine-hero__label", { opacity: 1, y: 0, duration: 0.8 }, 0.35)
    .to(titleLines, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: "power3.out" }, 0.45)
    .to(".svc-cine-hero__sub", { opacity: 1, y: 0, duration: 0.85 }, 0.7)
    .to(".svc-cine-hero__stat", { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 }, 0.85)
    .to(cards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.8)
    .to(".svc-cine-hero__ticker", { opacity: 1, y: 0, duration: 0.85 }, 1.05)
    .to(".svc-cine-hero__scroll", { opacity: 1, duration: 0.8 }, 1.25);
}

function initHeroParallax() {
  const cards = document.querySelector(".svc-cine-hero__cards");
  if (!cards || window.innerWidth < 900) return;

  cards.addEventListener("mousemove", (e) => {
    const rect = cards.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cards.querySelectorAll(".svc-cine-hero__card"), {
      x: (i) => x * (24 + i * 10),
      y: (i) => y * (16 + i * 6),
      rotateY: (i) => x * (6 + i * 3),
      duration: 0.6,
      ease: "power2.out",
    });
  });

  cards.addEventListener("mouseleave", () => {
    gsap.to(cards.querySelectorAll(".svc-cine-hero__card"), {
      x: 0,
      y: 0,
      rotateY: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  });
}

function initGateway() {
  const gateway = document.getElementById("svc-gateway");
  const beam = gateway?.querySelector(".svc-gateway__beam");

  if (beam) {
    gsap.to(beam, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: gateway,
        start: "top 60%",
        end: "bottom 30%",
        scrub: 1.2,
      },
    });
  }

  gsap.utils
    .toArray(".svc-gateway__label, .svc-gateway__title, .svc-gateway__lead, .svc-gateway__text p")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    });
}

function initHorizontalStage() {
  const stage = document.getElementById("svc-stage");
  const track = document.getElementById("svc-stage-track");
  const slides = gsap.utils.toArray(".svc-stage__slide");
  const navLinks = document.querySelectorAll(".svc-stage__nav-link");
  const fill = document.getElementById("svc-stage-fill");

  if (!stage || !track || slides.length < 2) return;

  const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const tween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: () => `+=${getScrollDistance()}`,
      pin: ".svc-stage__pin",
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (slides.length - 1),
        duration: { min: 0.2, max: 0.6 },
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        const progress = self.progress;
        if (fill) fill.style.width = `${progress * 100}%`;

        let slideIndex = Math.min(slides.length - 1, Math.round(progress * (slides.length - 1)));
        navLinks.forEach((link, i) => link.classList.toggle("is-active", i === slideIndex));

        let local = (progress * slides.length) % 1;
        if (progress >= 0.995) {
          slideIndex = slides.length - 1;
          local = 1;
        }

        const slide = slides[slideIndex];
        const steps = slide?.querySelectorAll(".svc-stage__step") || [];
        const activeStep = Math.min(steps.length - 1, Math.floor(local * steps.length));

        steps.forEach((step, i) => step.classList.toggle("is-active", i <= activeStep));
        slides.forEach((s, i) => s.classList.toggle("is-current", i === slideIndex));
      },
    },
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(link.dataset.index, 10);
      const st = tween.scrollTrigger;
      if (!st) return;
      const target = st.start + (st.end - st.start) * (index / (slides.length - 1));
      window.scrollTo({ top: target, behavior: "smooth" });
    });
  });

  slides.forEach((slide) => {
    const bg = slide.querySelector(".svc-stage__slide-bg img");
    if (bg) {
      gsap.fromTo(
        bg,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        }
      );
    }
  });
}

function initTheater() {
  const head = document.querySelector(".svc-theater__head");
  if (head) {
    gsap.from(head.children, {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: head,
        start: "top 88%",
        once: true,
      },
    });
  }

  document.querySelectorAll(".svc-act").forEach((act) => {
    const beam = act.querySelector(".svc-act__beam");
    const glow = act.querySelector(".svc-act__glow");
    const visual = act.querySelector("[data-act-visual]");
    const headCopy = act.querySelectorAll(".svc-act__head-copy > *");
    const panels = act.querySelectorAll("[data-act-panel]");
    const steps = act.querySelectorAll("[data-act-step]");
    const footer = act.querySelector("[data-act-footer]");

    if (beam) {
      gsap.to(beam, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: act,
          start: "top 60%",
          end: "bottom 25%",
          scrub: 1,
        },
      });
    }

    if (glow) {
      gsap.fromTo(
        glow,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: act,
            start: "top 75%",
            end: "center center",
            scrub: 1.2,
          },
        }
      );
    }

    gsap.set(visual, { opacity: 0, scale: 0.94, filter: "blur(10px)" });
    gsap.set(headCopy, { opacity: 0, y: 36 });
    gsap.set(panels, { opacity: 0, y: 32, scale: 0.98 });
    gsap.set(steps, { opacity: 0, y: 20 });
    gsap.set(footer, { opacity: 0, y: 28 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: act,
        start: "top 78%",
        once: true,
      },
      onComplete: () => act.classList.add("is-revealed"),
    });

    tl.to(visual, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.3,
      ease: "power3.out",
    })
      .to(
        headCopy,
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: "power3.out" },
        "-=1"
      )
      .to(
        panels,
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.14, ease: "power3.out" },
        "-=0.65"
      )
      .to(steps, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power2.out" }, "-=0.45")
      .to(footer, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" }, "-=0.35");
  });
}

function initMatrix() {
  const matrix = document.getElementById("svc-matrix");
  const spotlight = document.getElementById("svc-matrix-spotlight");
  const cards = document.querySelectorAll(".svc-matrix__card");

  if (matrix && spotlight && window.innerWidth >= 768) {
    matrix.addEventListener("mousemove", (e) => {
      const rect = matrix.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(spotlight, { x, y, duration: 0.35, ease: "power2.out" });
    });
  }

  gsap.from(".svc-matrix__card", {
    opacity: 0,
    y: 48,
    duration: 0.95,
    stagger: 0.14,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: ".svc-matrix__grid",
      start: "top 82%",
      once: true,
    },
  });

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 14,
        rotateX: -y * 10,
        y: -8,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 900,
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: "power3.out" });
    });
  });
}

function initFaq() {
  gsap.from(".svc-faq-stage__item", {
    opacity: 0,
    y: 20,
    duration: 0.85,
    stagger: 0.08,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: ".svc-faq-stage__list",
      start: "top 84%",
      once: true,
    },
  });
}

function initCta() {
  const inner = document.querySelector(".svc-cta-cine__inner");
  if (!inner) return;

  gsap.from(inner.children, {
    opacity: 0,
    y: 56,
    duration: 1.1,
    stagger: 0.14,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: inner,
      start: "top 78%",
      once: true,
    },
  });

  gsap.to(".svc-cta-cine__bg", {
    backgroundPosition: "50% 60%",
    ease: "none",
    scrollTrigger: {
      trigger: ".svc-cta-cine",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}