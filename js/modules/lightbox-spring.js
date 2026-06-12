import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { prefersReducedMotion } from "./utils.js";

export function initLightboxSpring(diplomas) {
  const root = document.getElementById("lightbox-spring");
  if (!root) return;

  const backdrop = root.querySelector(".lightbox-spring__backdrop");
  const frame = root.querySelector(".lightbox-spring__frame");
  const img = root.querySelector(".lightbox-spring__frame img");
  const caption = root.querySelector(".lightbox-spring__caption");
  const closeBtn = root.querySelector(".lightbox-spring__close");

  let isOpen = false;

  const open = (src, title) => {
    if (isOpen) return;
    isOpen = true;
    img.src = src;
    img.alt = title;
    caption.textContent = title;
    root.classList.add("is-open");
    root.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    const duration = prefersReducedMotion() ? 0.2 : 0.85;

    gsap.to(root, { opacity: 1, duration: duration * 0.4 });
    gsap.to(backdrop, {
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      duration,
      ease: "power2.out",
    });
    gsap.to(frame, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration,
      ease: "elastic.out(1, 0.65)",
    });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    const tl = gsap.timeline({
      onComplete: () => {
        root.classList.remove("is-open");
        root.setAttribute("hidden", "");
        document.body.style.overflow = "";
        img.src = "";
        gsap.set([root, backdrop, frame], { clearProps: "all" });
        root.style.opacity = "0";
        frame.style.transform = "scale(0.7) translateY(40px)";
        frame.style.opacity = "0";
      },
    });

    tl.to(frame, {
      scale: 0.85,
      y: 30,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    }).to(
      backdrop,
      {
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
        duration: 0.3,
      },
      0
    ).to(root, { opacity: 0, duration: 0.25 }, 0.1);
  };

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.getElementById("diplomas-grid")?.addEventListener("click", (e) => {
    const card = e.target.closest(".diploma-card");
    if (!card) return;
    const index = parseInt(card.dataset.index, 10);
    const diploma = diplomas[index];
    if (diploma) open(diploma.src, diploma.desc ? `${diploma.title} — ${diploma.desc}` : diploma.title);
  });

  return { open, close };
}

export function renderDiplomas(diplomas) {
  const grid = document.getElementById("diplomas-grid");
  if (!grid) return;

  grid.innerHTML = diplomas
    .map(
      (d, i) => `
    <article class="diploma-card" data-index="${i}" data-cursor="hover" role="button" tabindex="0" aria-label="Открыть ${d.title}">
      <img src="${d.src}" alt="${d.title}" loading="lazy">
      <span class="diploma-card__zoom" aria-hidden="true">⊕</span>
      <span class="diploma-card__label">${d.title}</span>
      ${d.desc ? `<p class="diploma-card__desc">${d.desc}</p>` : ""}
    </article>
  `
    )
    .join("");

  grid.querySelectorAll(".diploma-card").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
}