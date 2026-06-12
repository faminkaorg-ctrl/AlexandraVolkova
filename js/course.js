import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";

import { COURSE_DATA } from "../data/content.js";
import { initPreloader } from "./modules/preloader.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initCanvasEnvironment } from "./modules/canvas-environment.js";
import { renderSubnav } from "./modules/subnav.js";
import { renderSiteFooter } from "./modules/footer.js";
import { initCourseAuth } from "./modules/course-auth.js";
import { renderCourse, getAllVideos } from "./modules/course-render.js";
import { initCourseLesson } from "./modules/course-lesson.js";
import { refreshScrollTriggers } from "./modules/reveal.js";
import { prefersReducedMotion } from "./modules/utils.js";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let environment = null;

function initLenis() {
  if (prefersReducedMotion()) return null;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initCoursePage() {
  environment = initCanvasEnvironment();
  renderSiteFooter();
  renderSubnav("course");
  initCursor();
  initNavigation();

  renderCourse(COURSE_DATA);
  initCourseAuth(COURSE_DATA.auth);
  initCourseLesson(getAllVideos(COURSE_DATA));

  gsap.from(".page-hero-course .page-hero-capital__inner > *", {
    opacity: 0,
    y: 28,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.15,
  });

  refreshScrollTriggers();
}

initPreloader({
  onComplete: () => {
    lenis = initLenis();
    initCoursePage();
  },
});

window.addEventListener("beforeunload", () => {
  lenis?.destroy();
  environment?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});