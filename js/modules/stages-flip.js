import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";

export function initStagesFlip(stages, stagePop) {
  const cards = document.querySelectorAll(".stage-card");
  const panel = document.getElementById("stages-panel");
  if (!cards.length || !panel) return;

  const panelNum = panel.querySelector(".stages__panel-num");
  const panelTitle = panel.querySelector(".stages__panel-title");
  const panelText = panel.querySelector(".stages__panel-text");

  let activeCard = null;

  const updatePanel = (stage) => {
    if (!stage) return;
    panelNum.textContent = String(stage.num).padStart(2, "0");
    panelTitle.textContent = stage.title;
    panelText.innerHTML = `<p style="color:var(--text-light-muted);line-height:1.65;">${stage.brief || ""}</p>`;
  };

  const selectCard = (card, stage) => {
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove("is-active");
    }

    card.classList.add("is-active");
    activeCard = card;
    updatePanel(stage);
    stagePop?.open(stage);

    gsap.fromTo(
      panel,
      { opacity: 0.6, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  };

  cards.forEach((card, index) => {
    const stage = stages[index];
    card.addEventListener("click", () => selectCard(card, stage));
  });

  if (cards[0] && stages[0]) {
    cards[0].classList.add("is-active");
    activeCard = cards[0];
    updatePanel(stages[0]);
  }
}