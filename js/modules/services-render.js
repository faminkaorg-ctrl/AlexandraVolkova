import { SERVICES_DATA } from "../../data/content.js";

export function renderServicesPage() {
  renderHero(SERVICES_DATA);
  renderGateway(SERVICES_DATA.deep);
  renderStage(SERVICES_DATA.services);
  renderTheater(SERVICES_DATA.services);
  renderMatrix(SERVICES_DATA.compare);
  renderFaq(SERVICES_DATA.faq);
  renderCta(SERVICES_DATA.cta);
}

function renderHero(data) {
  const sub = document.getElementById("svc-hero-sub");
  const stats = document.getElementById("svc-hero-stats");
  const cards = document.getElementById("svc-hero-cards");
  const ticker = document.getElementById("svc-ticker");

  if (sub && data.deep) sub.textContent = data.deep.lead;

  if (stats) {
    stats.innerHTML = data.services
      .map(
        (s) => `
      <a href="#${s.id}" class="svc-cine-hero__stat" data-cursor="hover">
        <span class="svc-cine-hero__stat-num">${s.num}</span>
        <span class="svc-cine-hero__stat-label">${s.title}</span>
      </a>`
      )
      .join("");
  }

  if (cards) {
    cards.innerHTML = data.services
      .map(
        (s, i) => `
      <div class="svc-cine-hero__card" style="--i:${i}" data-service="${s.id}">
        <img src="${s.thumb}" alt="" loading="eager" width="400" height="500">
        <span class="svc-cine-hero__card-num">${s.num}</span>
        <span class="svc-cine-hero__card-title">${s.title}</span>
      </div>`
      )
      .join("");
  }

  if (ticker) {
    const items = data.services.flatMap((s) => s.tags);
    const line = [...items, ...items].map((t) => `<span>${t}</span>`).join("");
    ticker.innerHTML = `<div class="svc-cine-hero__ticker-inner">${line}</div>`;
  }
}

function renderGateway(deep) {
  const label = document.getElementById("svc-gateway-label");
  const title = document.getElementById("svc-gateway-title");
  const lead = document.getElementById("svc-gateway-lead");
  const text = document.getElementById("svc-gateway-text");

  if (label) label.textContent = deep.label;
  if (title) title.textContent = deep.title;
  if (lead) lead.textContent = deep.lead;

  if (text) {
    text.innerHTML = [deep.text, deep.text2]
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("");
  }
}

function renderStage(services) {
  const track = document.getElementById("svc-stage-track");
  const nav = document.getElementById("svc-stage-nav");
  if (!track) return;

  track.innerHTML = services.map((s) => renderStageSlide(s)).join("");

  if (nav) {
    nav.innerHTML = services
      .map(
        (s, i) => `
      <a href="#${s.id}" class="svc-stage__nav-link${i === 0 ? " is-active" : ""}" data-index="${i}" data-cursor="hover">
        <span>${s.num}</span>
        <span>${s.title}</span>
      </a>`
      )
      .join("");
  }
}

function renderStageSlide(s) {
  const accent = s.tagsAccent === "sage" ? " svc-stage__slide--sage" : "";

  return `
  <article class="svc-stage__slide${accent}" data-slide="${s.num}" id="${s.id}">
    <div class="svc-stage__slide-bg">
      <img src="${s.thumb}" alt="" loading="lazy" width="1920" height="1080">
    </div>
    <div class="svc-stage__slide-overlay"></div>
    <span class="svc-stage__watermark" aria-hidden="true">${s.num}</span>
    <div class="svc-stage__slide-inner">
      <div class="svc-stage__slide-copy">
        <span class="svc-stage__eyebrow">${s.lead || s.title}</span>
        <h2 class="svc-stage__title">${s.title}</h2>
        <p class="svc-stage__pitch">${s.desc}</p>
        ${s.longDesc ? `<p class="svc-stage__story">${s.longDesc}</p>` : ""}
        <div class="svc-stage__tags">
          ${s.tags.map((t) => `<span class="svc-tag${s.tagsAccent === "sage" ? " svc-tag--sage" : ""}">${t}</span>`).join("")}
        </div>
        <ul class="svc-stage__outcomes">
          ${(s.outcomes || []).slice(0, 4).map((o) => `<li>${o}</li>`).join("")}
        </ul>
        <a href="reviews.html?service=${s.id}#contact" class="btn-cta svc-stage__btn" data-cursor="hover">
          <span class="btn-cta__glow"></span>
          Войти в ${s.title.toLowerCase()}
        </a>
      </div>
      <div class="svc-stage__orb svc-gfx svc-gfx--${s.gfx}" aria-hidden="true">
        <span class="svc-gfx__ring"></span>
        <span class="svc-gfx__ring"></span>
        <span class="svc-gfx__ring"></span>
        <span class="svc-gfx__core">${s.gfxCore}</span>
      </div>
    </div>
    <div class="svc-stage__steps" aria-label="Этапы">
      ${s.steps
        .map(
          (step, i) => `
        <div class="svc-stage__step" data-step="${i}">
          <span class="svc-stage__step-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="svc-stage__step-title">${step.title}</span>
        </div>`
        )
        .join("")}
    </div>
  </article>`;
}

function renderTheater(services) {
  const wrap = document.getElementById("svc-theater-acts");
  if (!wrap) return;
  wrap.innerHTML = services.map((s) => renderTheaterAct(s)).join("");
}

function renderTheaterAct(s) {
  const accent = s.tagsAccent === "sage" ? " svc-act--sage" : "";
  const tagClass = s.tagsAccent === "sage" ? " svc-tag--sage" : "";

  const noteBlock = s.note
    ? `
    <aside class="svc-act__panel svc-act__panel--note">
      <h4>${s.note.title}</h4>
      <ul>${s.note.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </aside>`
    : "";

  return `
  <article class="svc-act${accent}" id="act-${s.id}" data-act="${s.num}">
    <div class="svc-act__beam" aria-hidden="true"></div>
    <div class="svc-act__glow" aria-hidden="true"></div>
    <div class="container svc-act__inner">
      <header class="svc-act__head">
        <div class="svc-act__head-copy">
          <span class="svc-act__num">${s.num}</span>
          <h3 class="svc-act__title">${s.title}</h3>
          <p class="svc-act__lead">${s.lead || ""}</p>
          <p class="svc-act__story">${s.longDesc || ""}</p>
          <div class="svc-act__tags">
            ${s.tags.map((t) => `<span class="svc-tag${tagClass}">${t}</span>`).join("")}
          </div>
        </div>
        <div class="svc-act__visual" data-act-visual>
          <img src="${s.thumb}" alt="${s.title}" loading="lazy" width="640" height="800">
          <div class="svc-act__visual-overlay"></div>
          <div class="svc-act__orb svc-gfx svc-gfx--${s.gfx}" aria-hidden="true">
            <span class="svc-gfx__ring"></span>
            <span class="svc-gfx__ring"></span>
            <span class="svc-gfx__core">${s.gfxCore}</span>
          </div>
        </div>
      </header>

      <div class="svc-act__bento">
        ${s.outcomes ? `
        <div class="svc-act__panel svc-act__panel--outcomes" data-act-panel>
          <h4>Результат</h4>
          <ul>${s.outcomes.map((o) => `<li><span>${o}</span></li>`).join("")}</ul>
        </div>` : ""}

        <div class="svc-act__panel svc-act__panel--fit" data-act-panel>
          ${s.forWhom ? `<p class="svc-act__for"><em>Кому</em> ${s.forWhom}</p>` : ""}
          ${s.notFor ? `<p class="svc-act__not"><em>Не для</em> ${s.notFor}</p>` : ""}
        </div>

        <div class="svc-act__panel svc-act__panel--terminal" data-act-panel>
          <div class="svc-act__terminal-head">
            <span class="svc-act__terminal-dot"></span>
            <span class="svc-act__terminal-dot"></span>
            <span class="svc-act__terminal-dot"></span>
            <span>${s.stepsTitle}</span>
          </div>
          <div class="svc-act__terminal-body">
            ${s.steps
              .map(
                (step, i) => `
              <div class="svc-act__step" data-act-step data-step="${i + 1}">
                <div class="svc-act__step-head">
                  <span class="svc-act__step-num">${String(i + 1).padStart(2, "0")}</span>
                  <h5>${step.title}</h5>
                </div>
                <p class="svc-act__step-text">${step.text}</p>
                ${step.detail ? `<p class="svc-act__step-detail">${step.detail}</p>` : ""}
              </div>`
              )
              .join("")}
          </div>
        </div>

        ${noteBlock}
      </div>

      <footer class="svc-act__footer" data-act-footer>
        <div class="svc-act__facts">
          ${s.facts.map((f) => `
            <div class="svc-act__fact">
              <span class="svc-act__fact-key">${f.key}</span>
              <span class="svc-act__fact-val">${f.val}</span>
            </div>`).join("")}
        </div>
        <a href="reviews.html?service=${s.id}#contact" class="btn-cta" data-cursor="hover">
          <span class="btn-cta__glow"></span>
          Войти в ${s.title.toLowerCase()}
        </a>
      </footer>
    </div>
  </article>`;
}

function renderMatrix(compare) {
  const title = document.getElementById("svc-matrix-title");
  const lead = document.getElementById("svc-matrix-lead");
  const grid = document.getElementById("svc-matrix-grid");

  if (title) title.textContent = compare.title;
  if (lead) lead.textContent = compare.lead;
  if (!grid) return;

  grid.innerHTML = compare.rows
    .map(
      (r) => `
    <article class="svc-matrix__card" data-cursor="hover">
      <span class="svc-matrix__num">${r.num}</span>
      <h3>${r.title}</h3>
      <p class="svc-matrix__focus">${r.focus}</p>
      <dl>
        <div><dt>Формат</dt><dd>${r.format}</dd></div>
        <div><dt>Итог</dt><dd>${r.result}</dd></div>
        <div><dt>Старт</dt><dd>${r.start}</dd></div>
      </dl>
    </article>`
    )
    .join("");
}

function renderFaq(faq) {
  const list = document.getElementById("svc-faq-list");
  if (!list) return;

  list.innerHTML = faq
    .map(
      (item, i) => `
    <details class="svc-faq-stage__item" data-index="${i}">
      <summary class="svc-faq-stage__q" data-cursor="hover">
        <span class="svc-faq-stage__q-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="svc-faq-stage__q-text">${item.q}</span>
        <span class="svc-faq-stage__q-icon" aria-hidden="true"></span>
      </summary>
      <div class="svc-faq-stage__a-wrap">
        <p class="svc-faq-stage__a">${item.a}</p>
      </div>
    </details>`
    )
    .join("");
}

function renderCta(cta) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };
  set("svc-cta-title", cta.title);
  set("svc-cta-lead", cta.lead);
  set("svc-cta-text", cta.text);
  set("svc-cta-channels", cta.channels);
}