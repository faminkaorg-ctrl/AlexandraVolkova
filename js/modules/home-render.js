import { HOME_DATA, ABOUT_DATA } from "../../data/content.js";

export function renderHomeSections() {
  renderHub(HOME_DATA.hub);
  renderServices(HOME_DATA.services);
  renderManifesto(ABOUT_DATA.manifesto);
}

function renderHub(items) {
  const grid = document.getElementById("home-hub");
  if (!grid) return;

  grid.innerHTML = items
    .map(
      (item) => `
    <a href="${item.href}" class="home-hub-card reveal-home" data-cursor="hover">
      <span class="home-hub-card__arrow" aria-hidden="true">↗</span>
      <div class="home-hub-card__thumb">
        <img src="${item.thumb}" alt="${item.title}" loading="lazy" width="480" height="360">
      </div>
      <div class="home-hub-card__body">
        <span class="home-hub-card__num">${item.num}</span>
        <h3 class="home-hub-card__title">${item.title}</h3>
        <p class="home-hub-card__text">${item.text}</p>
        <span class="home-hub-card__tag">${item.tag}</span>
      </div>
    </a>`
    )
    .join("");
}

function renderServices(items) {
  const list = document.getElementById("home-services");
  if (!list) return;

  list.innerHTML = items
    .map(
      (item) => `
    <a href="${item.href}" class="home-svc-card reveal-home" data-cursor="hover">
      <div class="home-svc-card__visual">
        <img src="${item.thumb}" alt="" loading="lazy" width="480" height="320">
        <span class="home-svc-card__num" aria-hidden="true">${item.num}</span>
        <span class="home-svc-card__arrow" aria-hidden="true">↗</span>
      </div>
      <div class="home-svc-card__body">
        <span class="home-svc-card__eyebrow">${item.lead || item.price}</span>
        <h3 class="home-svc-card__title">${item.title}</h3>
        <p class="home-svc-card__desc">${item.desc}</p>
        ${item.tags ? `<div class="home-svc-card__tags">${item.tags.map((t) => `<span>${t}</span>`).join("")}</div>` : ""}
        <span class="home-svc-card__price">${item.price}</span>
      </div>
    </a>`
    )
    .join("");
}

function renderManifesto(manifesto) {
  const notList = document.getElementById("manifesto-not");
  const yesList = document.getElementById("manifesto-yes");
  if (!notList || !yesList) return;

  const label = (item) => (typeof item === "string" ? item : item.title);
  notList.innerHTML = manifesto.not.map((t) => `<li>${label(t)}</li>`).join("");
  yesList.innerHTML = manifesto.yes.map((t) => `<li>${label(t)}</li>`).join("");
}