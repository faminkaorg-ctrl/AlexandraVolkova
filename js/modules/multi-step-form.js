import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { PERSON } from "../../data/content.js";

const STAGE_LABELS = {
  "1": "Доход уходит",
  "2": "Мёртвый груз",
  "3": "Хаос",
  "4": "Без уверенности",
  "5-7": "Есть система",
};

const SERVICE_LABELS = {
  consultation: "Консультация 30 мин (бесплатно)",
  investments: "Инвестиции",
  audit: "Личный аудит капитала",
  other: "Другое",
};

export function initMultiStepForm(stages, services) {
  const wizard = document.getElementById("form-wizard");
  if (!wizard) return;

  const track = wizard.querySelector(".form-wizard__track");
  const dots = wizard.querySelectorAll(".form-wizard__step-dot");
  const btnBack = wizard.querySelector(".form-wizard__btn--back");
  const btnNext = wizard.querySelector(".form-wizard__btn--next");
  const btnSubmit = wizard.querySelector(".form-wizard__btn--submit");
  const successPanel = wizard.querySelector(".form-wizard__success");
  const viewport = wizard.querySelector(".form-wizard__viewport");
  const chipsContainer = wizard.querySelector(".form-chips");

  let step = 0;
  let selectedStage = "";

  if (chipsContainer) {
    chipsContainer.innerHTML = stages
      .map(
        (s) =>
          `<button type="button" class="form-chip" data-stage="${s.id}">${s.label}</button>`
      )
      .join("");

    chipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".form-chip");
      if (!chip) return;
      chipsContainer.querySelectorAll(".form-chip").forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      selectedStage = chip.dataset.stage;
    });
  }

  const serviceSelect = wizard.querySelector("#form-service");
  if (serviceSelect) {
    serviceSelect.innerHTML =
      `<option value="" disabled selected>Выберите услугу</option>` +
      services.map((s) => `<option value="${s.id}">${s.label}</option>`).join("");
  }

  const goToStep = (index, direction = 1) => {
    step = index;
    track.style.transform = `translateX(-${step * 33.333}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === step);
      dot.classList.toggle("is-done", i < step);
    });

    btnBack.style.visibility = step === 0 ? "hidden" : "visible";
    btnNext.style.display = step < 2 ? "flex" : "none";
    btnSubmit.style.display = step === 2 ? "flex" : "none";

    if (viewport) {
      gsap.fromTo(
        viewport,
        { opacity: 0.6, x: direction * 20 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  };

  const validateStep = () => {
    if (step === 0) {
      const name = wizard.querySelector("#form-name")?.value.trim();
      const contact = wizard.querySelector("#form-contact")?.value.trim();
      if (!name || !contact) {
        shakeField(!name ? "#form-name" : "#form-contact");
        return false;
      }
    }
    if (step === 1) {
      const service = serviceSelect?.value;
      if (!service) {
        shakeField("#form-service");
        return false;
      }
    }
    return true;
  };

  const shakeField = (selector) => {
    const el = wizard.querySelector(selector);
    if (!el) return;
    gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
  };

  btnBack?.addEventListener("click", () => {
    if (step > 0) goToStep(step - 1, -1);
  });

  btnNext?.addEventListener("click", () => {
    if (!validateStep()) return;
    if (step < 2) goToStep(step + 1, 1);
  });

  btnSubmit?.addEventListener("click", async () => {
    const name = wizard.querySelector("#form-name")?.value.trim();
    const contact = wizard.querySelector("#form-contact")?.value.trim();
    const service = serviceSelect?.value;
    const message = wizard.querySelector("#form-message")?.value.trim() || "—";

    if (!name || !contact || !service) return;

    btnSubmit.disabled = true;
    btnSubmit.classList.add("is-loading");

    await new Promise((r) => setTimeout(r, 1200));

    btnSubmit.classList.remove("is-loading");
    btnSubmit.classList.add("is-success");

    await new Promise((r) => setTimeout(r, 600));

    const text = [
      "✦ Заявка — Private Capital",
      "",
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      `Услуга: ${SERVICE_LABELS[service] || service}`,
      `Стадия: ${STAGE_LABELS[selectedStage] || "не указана"}`,
      `Запрос: ${message}`,
    ].join("\n");

    const tgUrl = `${PERSON.telegram}?text=${encodeURIComponent(text)}`;
    const waUrl = `${PERSON.whatsapp}`;

    wizard.querySelector(".form-wizard__viewport").style.display = "none";
    wizard.querySelector(".form-wizard__actions").style.display = "none";
    wizard.querySelector(".form-wizard__steps").style.display = "none";

    successPanel.classList.add("is-visible");
    const tgLink = successPanel.querySelector("[data-open-telegram]");
    const waLink = successPanel.querySelector("[data-open-whatsapp]");
    if (tgLink) tgLink.href = tgUrl;
    if (waLink) waLink.href = waUrl;

    window.open(tgUrl, "_blank", "noopener");
  });

  const presetService = new URLSearchParams(window.location.search).get("service");
  if (presetService && serviceSelect) {
    const option = serviceSelect.querySelector(`option[value="${presetService}"]`);
    if (option) serviceSelect.value = presetService;
  }

  if (window.location.hash === "#contact" && wizard) {
    requestAnimationFrame(() => {
      wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  goToStep(0);
}