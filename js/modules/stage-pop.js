import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { prefersReducedMotion } from "./utils.js";

export function initStagePop(stages) {
  const root = document.getElementById("stage-pop");
  if (!root) return { open: () => {}, close: () => {} };

  const backdrop = root.querySelector(".stage-pop__backdrop");
  const box = root.querySelector(".stage-pop__box");
  const numEl = document.getElementById("stage-pop-num");
  const titleEl = document.getElementById("stage-pop-title");
  const briefEl = document.getElementById("stage-pop-brief");
  const signsEl = document.getElementById("stage-pop-signs");
  const nextEl = document.getElementById("stage-pop-next");

  let isOpen = false;
  let lastFocus = null;

  const fill = (stage) => {
    if (!stage) return;
    numEl.textContent = `Стадия ${String(stage.num).padStart(2, "0")}`;
    titleEl.textContent = stage.title;
    briefEl.textContent = stage.brief || "";
    signsEl.innerHTML = (stage.signs || []).map((s) => `<li>${s}</li>`).join("");
    nextEl.innerHTML = `<strong>Следующий шаг:</strong> ${stage.next || ""}`;
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

  const open = (stage) => {
    if (!stage) return;

    if (isOpen) {
      fill(stage);
      return;
    }

    isOpen = true;
    lastFocus = document.activeElement;
    fill(stage);
    showInstant();

    if (prefersReducedMotion()) {
      root.querySelector(".stage-pop__close")?.focus();
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

    root.querySelector(".stage-pop__close")?.focus();
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

  root.querySelectorAll("[data-stage-pop-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });

  document.getElementById("stages-timeline")?.addEventListener("click", (e) => {
    const card = e.target.closest(".stage-card");
    if (!card) return;
    const num = parseInt(card.dataset.stage, 10);
    const stage = stages.find((s) => s.num === num);
    if (stage) open(stage);
  });

  return { open, close, fill };
}