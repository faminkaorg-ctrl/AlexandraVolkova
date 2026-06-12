import { refreshScrollTriggers, showReveals } from "./reveal.js";
import { hideCourseLesson } from "./course-lesson.js";

const STORAGE_KEY = "course-auth-v1";

export function isCourseAuthed() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function setCourseAuthed(value) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export function initCourseAuth(auth) {
  const gate = document.getElementById("course-gate");
  const content = document.getElementById("course-content");
  const form = document.getElementById("course-login-form");
  const errorEl = document.getElementById("course-login-error");
  const logoutBtn = document.getElementById("course-logout");

  if (!gate || !content || !form) return;

  const showContent = () => {
    gate.hidden = true;
    content.hidden = false;
    hideCourseLesson();
    requestAnimationFrame(() => {
      refreshScrollTriggers();
      showReveals("#course-content .reveal-course");
    });
  };

  const showGate = () => {
    gate.hidden = false;
    content.hidden = true;
    hideCourseLesson();
  };

  const showError = (msg) => {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.add("is-visible");
  };

  const hideError = () => {
    errorEl?.classList.remove("is-visible");
  };

  if (isCourseAuthed()) {
    showContent();
  } else {
    showGate();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const login = form.login?.value?.trim() ?? "";
    const password = form.password?.value ?? "";

    if (login === auth.demoLogin && password === auth.demoPassword) {
      setCourseAuthed(true);
      showContent();
      form.reset();
      return;
    }

    showError("Неверный логин или пароль. Получите доступ у Татьяны.");
  });

  logoutBtn?.addEventListener("click", () => {
    setCourseAuthed(false);
    showGate();
    hideError();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return { showContent, showGate };
}