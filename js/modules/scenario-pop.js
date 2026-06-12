import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { prefersReducedMotion } from "./utils.js";

export function initScenarioPop() {
  const root = document.getElementById("scenario-pop");
  if (!root) return { open: () => {}, close: () => {} };

  const backdrop = root.querySelector(".scenario-pop__backdrop");
  const box = root.querySelector(".scenario-pop__box");
  const numEl = document.getElementById("scenario-pop-num");
  const titleEl = document.getElementById("scenario-pop-title");
  const briefEl = document.getElementById("scenario-pop-brief");
  const forEl = document.getElementById("scenario-pop-for");
  const stepsEl = document.getElementById("scenario-pop-steps");
  const notEl = document.getElementById("scenario-pop-not");

  let isOpen = false;
  let lastFocus = null;

  const fill = (scenario) => {
    if (!scenario) return;

    root.classList.toggle("scenario-pop--sage", scenario.accent === "sage");
    root.classList.toggle("scenario-pop--gold", scenario.accent !== "sage");

    numEl.textContent = `Сценарий ${scenario.num}`;
    titleEl.textContent = scenario.title;
    briefEl.textContent = scenario.desc || "";
    forEl.textContent = scenario.forWhom || "";
    stepsEl.innerHTML = (scenario.steps || []).map((step) => `<li>${step}</li>`).join("");
    notEl.textContent = scenario.notWhen || "";
  };

  const showInstant = () => {
    root.classList.add("is-open");
    root.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    gsap.set(root, { opacity: 1, visibility: "visible" });
    gsap.set(box, { opacity: 1, y: 0, scale: 1 });
    gsap.set(backdrop, {
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    });
  };

  const hideInstant = () => {
    root.classList.remove("is-open");
    root.setAttribute("hidden", "");
    document.body.style.overflow = "";
    gsap.set([root, backdrop, box], { clearProps: "all" });
  };

  const open = (scenario) => {
    if (!scenario) return;

    if (isOpen) {
      fill(scenario);
      return;
    }

    isOpen = true;
    lastFocus = document.activeElement;
    fill(scenario);
    showInstant();

    if (prefersReducedMotion()) {
      root.querySelector(".scenario-pop__close")?.focus();
      return;
    }

    const duration = 0.55;

    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: duration * 0.35, overwrite: true });
    gsap.fromTo(
      backdrop,
      { backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" },
      { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", duration, ease: "power2.out", overwrite: true }
    );
    gsap.fromTo(
      box,
      { opacity: 0, y: 32, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration, ease: "power3.out", overwrite: true }
    );

    root.querySelector(".scenario-pop__close")?.focus();
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    const finish = () => {
      hideInstant();
      lastFocus?.focus?.();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const duration = 0.35;

    gsap.to(box, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      duration,
      ease: "power2.in",
      overwrite: true,
    });
    gsap.to(backdrop, {
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      duration,
      overwrite: true,
    });
    gsap.to(root, {
      opacity: 0,
      duration: duration * 0.8,
      overwrite: true,
      onComplete: finish,
    });
  };

  root.querySelectorAll("[data-scenario-pop-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });

  return { open, close, fill };
}