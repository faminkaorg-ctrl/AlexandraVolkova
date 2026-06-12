import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { splitWords, prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export function initHero(lenis) {
  const title = document.getElementById("hero-title");
  const eyebrow = document.querySelector(".hero__eyebrow");
  const desc = document.querySelector(".hero__desc");
  const actions = document.querySelector(".hero__actions");
  const stats = document.querySelector(".hero__stats");
  const portraitWrap = document.querySelector(".hero__portrait-wrap");
  const portraitImg = document.querySelector(".hero__portrait-mask img");
  const badge = document.querySelector(".hero__portrait-badge");
  const floatCard = document.querySelector(".hero__float-card");

  initRippleButtons();

  if (prefersReducedMotion()) {
    document.querySelectorAll(".hero__title-word").forEach((w) => {
      w.style.transform = "none";
      w.style.opacity = "1";
    });
    [eyebrow, desc, actions, stats, badge, floatCard].forEach((el) => {
      if (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
    return;
  }

  const words = title ? splitWords(title) : [];

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(words, {
    y: 0,
    opacity: 1,
    duration: 1.1,
    stagger: 0.045,
    ease: "power4.out",
  })
    .to(eyebrow, { opacity: 1, duration: 0.8 }, "-=0.7")
    .to(desc, { opacity: 1, y: 0, duration: 0.9 }, "-=0.5")
    .to(actions, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(stats, { opacity: 1, duration: 0.8 }, "-=0.5")
    .to(badge, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6")
    .to(floatCard, { opacity: 1, y: 0, rotate: 0, duration: 1, ease: "back.out(1.4)" }, "-=0.7");

  if (portraitWrap && portraitImg) {
    gsap.to(portraitImg, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    gsap.to(portraitWrap, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            },
          }
        );
      },
    });
  });

  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
  }
}

function initRippleButtons() {
  document.querySelectorAll(".btn-cta").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-cta__ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}