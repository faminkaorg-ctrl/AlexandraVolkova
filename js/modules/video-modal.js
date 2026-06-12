import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { prefersReducedMotion } from "./utils.js";

export function initVideoModal() {
  const modal = document.getElementById("video-modal");
  if (!modal) return;

  const backdrop = modal.querySelector(".video-modal__backdrop");
  const panel = modal.querySelector(".video-modal__panel");
  const titleEl = modal.querySelector(".video-modal__title");
  const frame = modal.querySelector(".video-modal__frame");
  const closeBtn = modal.querySelector(".video-modal__close");

  let isOpen = false;

  const open = (videoId, title) => {
    if (isOpen) close(false);
    isOpen = true;

    titleEl.textContent = title;
    frame.innerHTML = "";

    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    const duration = prefersReducedMotion() ? 0.2 : 0.55;

    gsap.to(modal, { opacity: 1, duration: duration * 0.5 });
    gsap.to(panel, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration,
      ease: "power3.out",
    });

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    frame.appendChild(iframe);
  };

  const close = (animate = true) => {
    if (!isOpen) return;
    isOpen = false;

    const finish = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("hidden", "");
      document.body.style.overflow = "";
      frame.innerHTML = "";
      gsap.set(modal, { opacity: 0 });
      gsap.set(panel, { scale: 0.92, y: 24, opacity: 0 });
    };

    if (!animate || prefersReducedMotion()) {
      finish();
      return;
    }

    gsap.to(panel, {
      scale: 0.94,
      y: 16,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: finish,
    });
    gsap.to(modal, { opacity: 0, duration: 0.25 }, 0.05);
  };

  closeBtn?.addEventListener("click", () => close());
  backdrop?.addEventListener("click", () => close());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });

  document.getElementById("reviews-grid")?.addEventListener("click", (e) => {
    const card = e.target.closest(".review-video-card");
    if (!card) return;
    open(card.dataset.videoId, card.dataset.title);
  });

  return { open, close };
}