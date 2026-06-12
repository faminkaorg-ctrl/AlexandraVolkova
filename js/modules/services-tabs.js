export function initServicesTabs() {
  const tabs = document.querySelectorAll(".svc-tabs__btn");
  const cards = document.querySelectorAll(".svc-card");
  const steps = document.querySelectorAll(".svc-step");

  if (cards.length && tabs.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          tabs.forEach((tab) => {
            tab.classList.toggle("is-active", tab.getAttribute("href") === `#${id}`);
          });
        });
      },
      { threshold: 0.25, rootMargin: "-30% 0px -55% 0px" }
    );

    cards.forEach((card) => observer.observe(card));
  }

  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          stepObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );

  steps.forEach((step) => stepObserver.observe(step));
}