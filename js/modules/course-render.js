import { bindReveal } from "./reveal.js";

const PLAY_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

function renderVideoCard(video, categoryLabel) {
  const accentClass = video.accent === "sage" ? "course-vid--sage" : "course-vid--gold";

  return `
    <article
      class="course-vid ${accentClass} reveal-course"
      data-course-video="${video.id}"
      role="button"
      tabindex="0"
      data-cursor="hover"
      aria-label="${video.title} — смотреть урок"
    >
      <div class="course-vid__thumb">
        <div class="course-vid__gradient course-vid__gradient--${video.theme}"></div>
        <div class="course-vid__overlay"></div>
        <span class="course-vid__num">${categoryLabel} · ${video.num}</span>
        <span class="course-vid__duration">${video.duration}</span>
        <span class="course-vid__play">${PLAY_SVG}</span>
      </div>
      <div class="course-vid__body">
        <h3 class="course-vid__title">${video.title}</h3>
        <p class="course-vid__desc">${video.desc}</p>
      </div>
    </article>`;
}

export function renderCourse(data) {
  const introWrap = document.getElementById("course-intro");
  const subGrid = document.getElementById("course-sub-grid");
  const invGrid = document.getElementById("course-inv-grid");

  if (introWrap && data.intro) {
    const v = data.intro;
    introWrap.innerHTML = `
      <article
        class="course-intro__card reveal-course"
        data-course-video="${v.id}"
        role="button"
        tabindex="0"
        data-cursor="hover"
        aria-label="${v.title} — смотреть введение"
      >
        <div class="course-intro__media">
          <div class="course-vid__gradient course-vid__gradient--${v.theme}" style="position:absolute;inset:0;"></div>
          <div class="course-vid__overlay"></div>
          <span class="course-vid__play" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">${PLAY_SVG}</span>
        </div>
        <div class="course-intro__body">
          <span class="course-intro__num">Введение · урок ${v.num}</span>
          <h3 class="course-intro__title">${v.title}</h3>
          <p class="course-intro__desc">${v.desc}</p>
          <div class="course-intro__meta">
            <span>${v.duration}</span>
            <span>·</span>
            <span>Начните отсюда</span>
          </div>
        </div>
      </article>`;
  }

  if (subGrid) {
    subGrid.innerHTML = data.subconscious.map((v) => renderVideoCard(v, "Подсознание")).join("");
  }

  if (invGrid) {
    invGrid.innerHTML = data.investments.map((v) => renderVideoCard(v, "Инвестиции")).join("");
  }

  bindReveal(".reveal-course", {
    y: 36,
    duration: 0.85,
    start: "top 88%",
    staggerMod: 3,
    staggerDelay: 0.07,
  });
}

export function getAllVideos(data) {
  return [data.intro, ...data.subconscious, ...data.investments];
}