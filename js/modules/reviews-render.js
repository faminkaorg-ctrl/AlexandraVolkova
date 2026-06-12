import { bindReveal } from "./reveal.js";

function thumbUrl(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

function thumbFallback(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function embedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function renderReviewsGrid(reviews) {
  const container = document.getElementById("yt-reviews-list");
  if (!container) return;

  container.innerHTML = reviews
    .map(
      (review) => `
    <article class="yt-review reveal-reviews">
      <div class="yt-review__media" data-yt-id="${review.id}">
        <button type="button" class="yt-review__poster" data-yt-id="${review.id}" aria-label="Воспроизвести видео-отзыв ${review.num}" data-cursor="hover">
          <span class="yt-review__badge">${review.num}</span>
          <img class="yt-review__thumb" src="${thumbUrl(review.id)}" alt="Превью: ${review.title}" loading="lazy">
          <span class="yt-review__overlay"><span class="yt-review__play" aria-hidden="true">▶</span></span>
        </button>
      </div>
      <div class="yt-review__body">
        <span class="yt-review__label">Видео-отзыв ${review.num}</span>
        <h3 class="yt-review__title">${review.title}</h3>
        <p class="yt-review__meta">${review.summary}</p>
        <div class="yt-review__actions">
          <a href="${review.url}" target="_blank" rel="noopener noreferrer" class="yt-review__yt-link" data-cursor="hover">Смотреть на YouTube ↗</a>
        </div>
      </div>
    </article>`
    )
    .join("");

  bindYoutubePlayers();

  bindReveal(".yt-review.reveal-reviews", {
    y: 40,
    duration: 0.85,
    start: "top 88%",
    staggerMod: 3,
    staggerDelay: 0.06,
  });
}

function bindYoutubePlayers() {
  document.querySelectorAll(".yt-review__poster").forEach((poster) => {
    const id = poster.dataset.ytId;
    if (!id) return;

    const img = poster.querySelector(".yt-review__thumb");
    if (img) {
      img.addEventListener(
        "error",
        () => {
          img.src = thumbFallback(id);
        },
        { once: true }
      );
    }

    const activate = () => {
      const media = poster.closest(".yt-review__media");
      if (!media || media.classList.contains("yt-review__media--playing")) return;

      media.classList.add("yt-review__media--playing");
      media.innerHTML = `
        <div class="yt-review__embed">
          <iframe
            src="${embedUrl(id)}"
            title="${poster.getAttribute("aria-label") || "Видео-отзыв"}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>`;
    };

    poster.addEventListener("click", activate);
    poster.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
}