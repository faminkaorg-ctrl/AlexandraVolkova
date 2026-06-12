import { prefersReducedMotion } from "./utils.js";

export function initPreloader({ onComplete }) {
  const preloader = document.getElementById("preloader");
  const nameEl = document.getElementById("preloader-name");
  const taglineEl = document.getElementById("preloader-tagline");
  const barWrap = document.getElementById("preloader-bar");
  const percentEl = document.getElementById("preloader-percent");

  if (!preloader) {
    document.documentElement.classList.add("js-ready");
    onComplete?.();
    return;
  }

  document.body.classList.add("is-loading");

  let progress = 0;
  const duration = prefersReducedMotion() ? 400 : 2200;
  const startTime = performance.now();

  const updateProgress = (value) => {
    progress = Math.min(100, value);
    barWrap?.style.setProperty("--progress", `${progress}%`);
    if (percentEl) percentEl.textContent = `${Math.round(progress)}%`;
  };

  const tick = (now) => {
    const elapsed = now - startTime;
    const eased = 1 - Math.pow(1 - Math.min(elapsed / duration, 1), 3);
    updateProgress(eased * 100);

    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      finish();
    }
  };

  const finish = () => {
    updateProgress(100);

    setTimeout(() => {
      preloader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      document.documentElement.classList.add("js-ready");
      onComplete?.();
    }, prefersReducedMotion() ? 100 : 600);
  };

  requestAnimationFrame(() => {
    nameEl?.classList.add("is-visible");
    setTimeout(() => taglineEl?.classList.add("is-visible"), 400);
    requestAnimationFrame(tick);
  });

  window.addEventListener("load", () => {
    if (progress < 85) updateProgress(85);
  });
}