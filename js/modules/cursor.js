import { lerp, isTouchDevice } from "./utils.js";

export function initCursor() {
  if (isTouchDevice()) return null;

  const cursor = document.getElementById("cursor");
  if (!cursor) return null;

  document.body.classList.add("has-custom-cursor");

  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  let isHovering = false;
  let isVisible = false;

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursor.classList.remove("is-hidden");
    }
  };

  const onLeave = () => {
    isVisible = false;
    cursor.classList.add("is-hidden");
  };

  const interactiveSelector =
    'a, button, [data-cursor="hover"], input, select, textarea, .btn-cta, .nav-panel__link, .header__burger, #assistant-root, #assistant-root *';

  const assistantSelector = "#assistant-root, #assistant-root *";

  const setAssistantHover = (active) => {
    cursor.classList.toggle("is-over-assistant", active);
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseleave", onLeave);

  document.addEventListener(
    "mouseover",
    (e) => {
      const overAssistant = !!e.target.closest(assistantSelector);
      setAssistantHover(overAssistant);
      if (overAssistant) return;

      if (e.target.closest(interactiveSelector)) {
        isHovering = true;
        cursor.classList.add("is-hovering");
      }
    },
    true
  );

  document.addEventListener(
    "mouseout",
    (e) => {
      const fromAssistant = e.target.closest(assistantSelector);
      const toAssistant = e.relatedTarget?.closest?.(assistantSelector);
      if (fromAssistant && !toAssistant) {
        setAssistantHover(false);
      }
      if (toAssistant) return;

      if (e.target.closest(interactiveSelector)) {
        isHovering = false;
        cursor.classList.remove("is-hovering");
      }
    },
    true
  );

  const animate = () => {
    dotX = lerp(dotX, mouseX, isHovering ? 0.35 : 0.55);
    dotY = lerp(dotY, mouseY, isHovering ? 0.35 : 0.55);
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);

    cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    if (dot) {
      dot.style.transform = `translate3d(${dotX - ringX}px, ${dotY - ringY}px, 0)`;
    }

    requestAnimationFrame(animate);
  };

  animate();

  return { destroy: () => {
    document.body.classList.remove("has-custom-cursor");
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseleave", onLeave);
  }};
}