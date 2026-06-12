export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches
  );
}

export function splitWords(element, wordClass = "hero__title-word") {
  const lines = element.querySelectorAll("[data-split-line]");
  const words = [];

  lines.forEach((line) => {
    const text = line.textContent.trim();
    line.textContent = "";
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement("span");
      span.className = wordClass;
      span.textContent = word;
      span.style.display = "inline-block";
      if (i > 0) line.appendChild(document.createTextNode(" "));
      line.appendChild(span);
      words.push(span);
    });
  });

  return words;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}