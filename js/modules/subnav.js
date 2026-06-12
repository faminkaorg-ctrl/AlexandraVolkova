const NAV_PAGES = [
  { href: "index.html", label: "Главная", key: "home" },
  { href: "about.html", label: "Обо мне", key: "about" },
  { href: "services.html", label: "Услуги", key: "services" },
  { href: "capital.html", label: "Капитал", key: "capital" },
  { href: "reviews.html", label: "Отзывы", key: "reviews" },
];

const COURSE_LINK = { href: "course.html", label: "Курс осознанности", key: "course" };

export function renderSubnav(activeKey) {
  const nav = document.getElementById("header-subnav");
  if (!nav) return;

  const courseBtn = `<a href="${COURSE_LINK.href}" class="header-course-btn${activeKey === COURSE_LINK.key ? " is-active" : ""}" data-cursor="hover">${COURSE_LINK.label}</a>`;

  const links = NAV_PAGES.map(
    (page) =>
      `<a href="${page.href}" class="header-subnav__link${page.key === activeKey ? " is-active" : ""}" data-cursor="hover">${page.label}</a>`
  ).join("");

  nav.innerHTML = courseBtn + links;
}