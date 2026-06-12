import { bindRevealEach } from "./reveal.js";
import { prefersReducedMotion } from "./utils.js";

export function renderTerminalTable(credentials) {
  const tbody = document.getElementById("terminal-tbody");
  if (!tbody) return;

  tbody.innerHTML = credentials
    .map(
      (c) => `
    <tr data-cursor="hover">
      <td data-label="Код"><span class="terminal__code">${c.code}</span></td>
      <td data-label="Область">${c.area}</td>
      <td data-label="Применение">${c.apply}</td>
    </tr>
  `
    )
    .join("");

  if (prefersReducedMotion()) return;

  bindRevealEach("#terminal-table tbody tr", {
    x: -24,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
    start: "top 80%",
    trigger: "#terminal-table",
  });

  const rows = document.querySelectorAll("#terminal-table tbody tr");
  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      const code = row.querySelector(".terminal__code");
      if (code) code.style.textShadow = "0 0 24px rgba(212, 175, 55, 0.8)";
    });
    row.addEventListener("mouseleave", () => {
      const code = row.querySelector(".terminal__code");
      if (code) code.style.textShadow = "0 0 20px rgba(212, 175, 55, 0.35)";
    });
  });
}