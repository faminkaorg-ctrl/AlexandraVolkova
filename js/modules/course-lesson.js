const PLAY_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

const CATEGORY_LABELS = {
  intro: "Введение",
  "sub-01": "Подсознание",
  "sub-02": "Подсознание",
  "sub-03": "Подсознание",
  "sub-04": "Подсознание",
  "sub-05": "Подсознание",
  "sub-06": "Подсознание",
  "sub-07": "Подсознание",
  "inv-01": "Инвестиции",
  "inv-02": "Инвестиции",
  "inv-03": "Инвестиции",
  "inv-04": "Инвестиции",
  "inv-05": "Инвестиции",
  "inv-06": "Инвестиции",
  "inv-07": "Инвестиции",
};

export function initCourseLesson(videos) {
  const panel = document.getElementById("course-lesson");
  const preview = document.getElementById("course-lesson-preview");
  const numEl = document.getElementById("course-lesson-num");
  const titleEl = document.getElementById("course-lesson-title");
  const descEl = document.getElementById("course-lesson-desc");
  const metaEl = document.getElementById("course-lesson-meta");
  const closeBtn = document.getElementById("course-lesson-close");
  const content = document.getElementById("course-content");

  if (!panel || !content) return;

  const byId = new Map(videos.map((v) => [v.id, v]));

  const close = () => {
    panel.hidden = true;
    content.querySelectorAll("[data-course-video].is-playing").forEach((el) => {
      el.classList.remove("is-playing");
    });
  };

  close();

  const open = (video, card) => {
    if (!video || content.hidden) return;

    numEl.textContent = `${CATEGORY_LABELS[video.id] || "Урок"} · ${video.num}`;
    titleEl.textContent = video.title;
    descEl.textContent = video.desc;
    metaEl.textContent = `${video.duration} · Татьяна`;

    preview.innerHTML = `
      <div class="course-lesson__gradient course-vid__gradient course-vid__gradient--${video.theme}"></div>
      <div class="course-lesson__play">${PLAY_SVG}</div>
      <span class="course-lesson__badge">Демо-просмотр</span>`;

    content.querySelectorAll("[data-course-video].is-playing").forEach((el) => {
      el.classList.remove("is-playing");
    });
    card?.classList.add("is-playing");

    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  closeBtn?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });

  content.addEventListener("click", (e) => {
    if (content.hidden) return;
    const card = e.target.closest("[data-course-video]");
    if (!card) return;
    const video = byId.get(card.dataset.courseVideo);
    if (video) open(video, card);
  });

  content.addEventListener("keydown", (e) => {
    if (content.hidden) return;
    const card = e.target.closest("[data-course-video]");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const video = byId.get(card.dataset.courseVideo);
      if (video) open(video, card);
    }
  });

  return { open, close };
}

export function hideCourseLesson() {
  const panel = document.getElementById("course-lesson");
  if (panel) panel.hidden = true;
}