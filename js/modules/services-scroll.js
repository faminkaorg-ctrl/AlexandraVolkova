import { bindReveal } from "./reveal.js";

export function initServicesScroll() {
  bindReveal(".reveal-services", {
    y: 40,
    duration: 1,
    start: "top 85%",
    filter: (el) => !el.closest(".svc-deep, .svc-stage, .svc-theater"),
  });
}