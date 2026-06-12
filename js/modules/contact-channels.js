import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import { PERSON } from "../../data/content.js";
import { prefersReducedMotion } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  phone: `<path class="draw-path" d="M6 4h4l2 5-2.5 1.5a11 11 0 005 5L16 13l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"/>`,
  telegram: `<path class="draw-path" d="M4 12L20 4l-3 16-5-4-4 3v-7"/><path class="draw-path" d="M17 7L9 13"/>`,
  email: `<path class="draw-path" d="M4 8l8 5 8-5"/><rect class="draw-path" x="4" y="6" width="16" height="12" rx="1"/>`,
  channel: `<circle class="draw-path" cx="12" cy="12" r="9"/><path class="draw-path" d="M8 12h8M12 8v8"/>`,
  whatsapp: `<path class="draw-path" d="M8 14c3 5 7 5 9 3l1-2a1 1 0 00-.3-1.2l-2-1a1 1 0 00-1.2.2l-.8 1"/><path class="draw-path" d="M9 9a7 7 0 109 9"/>`,
  aurum: `<polygon class="draw-path" points="12,3 15,9 21,9 16,14 18,21 12,17 6,21 8,14 3,9 9,9"/>`,
};

export function renderContactChannels() {
  const list = document.getElementById("contact-channels");
  if (!list) return;

  const channels = [
    { icon: "phone", label: "Телефон", value: PERSON.phone, href: `tel:${PERSON.phone}` },
    { icon: "telegram", label: "Telegram", value: "@alexavolkova", href: PERSON.telegram },
    { icon: "channel", label: "Канал", value: "@privatecapitalalexa", href: PERSON.telegramChannel },
    { icon: "whatsapp", label: "WhatsApp", value: "Написать", href: PERSON.whatsapp },
    { icon: "email", label: "Email", value: PERSON.email, href: `mailto:${PERSON.email}` },
    { icon: "aurum", label: "AURUM Club", value: "Закрытое сообщество", href: PERSON.aurum },
  ];

  list.innerHTML = channels
    .map(
      (c) => `
    <a href="${c.href}" class="contact-channel" target="${c.href.startsWith("http") ? "_blank" : "_self"}" rel="noopener noreferrer" data-cursor="hover">
      <div class="contact-channel__icon">
        <svg viewBox="0 0 24 24">${ICONS[c.icon]}</svg>
      </div>
      <div class="contact-channel__text">
        <div class="contact-channel__label">${c.label}</div>
        <div class="contact-channel__value">${c.value}</div>
      </div>
    </a>
  `
    )
    .join("");

  if (prefersReducedMotion()) {
    list.querySelectorAll(".contact-channel").forEach((el) => el.classList.add("is-drawn"));
    return;
  }

  ScrollTrigger.batch(list.querySelectorAll(".contact-channel"), {
    start: "top 90%",
    once: true,
    onEnter: (batch) => {
      batch.forEach((el, i) => {
        setTimeout(() => el.classList.add("is-drawn"), i * 80);
      });
    },
  });
}