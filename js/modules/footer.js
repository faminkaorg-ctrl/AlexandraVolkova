import { PERSON } from "../../data/content.js";

export function renderSiteFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-full__grid">
        <div>
          <p class="footer-full__brand-name">Александра Волкова</p>
          <p class="footer-full__brand-tag">Private Capital · Стратегия капитала</p>
          <p>Стратегия капитала · Инвестиции · Спокойствие · Гипнотерапия</p>
          <div class="footer-full__social">
            <a href="${PERSON.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="hover">TG</a>
            <a href="${PERSON.telegramChannel}" target="_blank" rel="noopener noreferrer" data-cursor="hover">Канал</a>
            <a href="${PERSON.youtube}" target="_blank" rel="noopener noreferrer" data-cursor="hover">YT</a>
          </div>
        </div>
        <div>
          <h4 class="footer-full__title">Разделы</h4>
          <ul class="footer-full__links">
            <li><a href="index.html" data-cursor="hover">Главная</a></li>
            <li><a href="about.html" data-cursor="hover">Обо мне</a></li>
            <li><a href="services.html" data-cursor="hover">Услуги</a></li>
            <li><a href="capital.html" data-cursor="hover">Капитал</a></li>
            <li><a href="reviews.html" data-cursor="hover">Отзывы + заявка</a></li>
            <li><a href="course.html" data-cursor="hover">Курс осознанности</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-full__title">Контакты</h4>
          <ul class="footer-full__links">
            <li><a href="tel:${PERSON.phone}" data-cursor="hover">${PERSON.phone}</a></li>
            <li><a href="${PERSON.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="hover">@alexavolkova</a></li>
            <li><a href="mailto:${PERSON.email}" data-cursor="hover">${PERSON.email}</a></li>
            <li><a href="${PERSON.whatsapp}" target="_blank" rel="noopener noreferrer" data-cursor="hover">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-full__title">Юридическое</h4>
          <ul class="footer-full__links">
            <li>${PERSON.legal}</li>
            <li>ИНН ${PERSON.inn}</li>
            <li><a href="${PERSON.aurum}" target="_blank" rel="noopener noreferrer" data-cursor="hover">AURUM Club</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-full__bottom">
        <span>© 2026 Александра Волкова · Private Capital</span>
        <span>Стратегия капитала · Инвестиции · Спокойствие</span>
      </div>
    </div>`;
}