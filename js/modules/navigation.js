import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { prefersReducedMotion } from "./utils.js";

export function initNavigation() {
  const burger = document.getElementById("nav-burger");
  const panel = document.getElementById("nav-panel");
  const links = panel?.querySelectorAll(".nav-panel__link") ?? [];
  const body = document.body;

  if (!burger || !panel) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    burger.classList.add("is-open");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden";

    if (!prefersReducedMotion()) {
      gsap.fromTo(
        links,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    }
  };

  const close = () => {
    isOpen = false;
    burger.classList.remove("is-open");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    body.style.overflow = "";

    if (!prefersReducedMotion()) {
      gsap.set(links, { y: 0, opacity: 1 });
    }
  };

  burger.addEventListener("click", () => {
    isOpen ? close() : open();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => close());
    initMagneticLink(link);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });
}

function initMagneticLink(link) {
  if (prefersReducedMotion()) return;

  const strength = 0.35;
  let bounds = null;

  link.addEventListener("mouseenter", () => {
    bounds = link.getBoundingClientRect();
  });

  link.addEventListener("mousemove", (e) => {
    if (!bounds) return;
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;
    gsap.to(link, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  link.addEventListener("mouseleave", () => {
    gsap.to(link, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
    bounds = null;
  });
}