(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var WARN_ID = "boot-warn";

  function dismissPreloader() {
    document.body.classList.remove("is-loading");
    var preloader = document.getElementById("preloader");
    if (preloader) preloader.classList.add("is-done");
  }

  function showWarning(html) {
    if (document.getElementById(WARN_ID)) return;

    var box = document.createElement("div");
    box.id = WARN_ID;
    box.setAttribute("role", "alert");
    box.innerHTML = html;
    box.style.cssText = [
      "position:fixed",
      "inset:24px",
      "z-index:100000",
      "padding:32px 36px",
      "background:#141210",
      "border:1px solid rgba(212,175,55,0.45)",
      "border-radius:16px",
      "color:#f5f2eb",
      "font:16px/1.65 Manrope,Segoe UI,sans-serif",
      "box-shadow:0 24px 80px rgba(0,0,0,0.65)",
      "max-width:560px",
      "margin:auto",
      "top:50%",
      "transform:translateY(-50%)",
      "height:fit-content",
    ].join(";");

    document.body.appendChild(box);
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function loadAssistant() {
    if (document.querySelector("script[data-assistant-loader]")) return;
    var script = document.createElement("script");
    script.src = "js/assistant.js?v=5";
    script.dataset.assistantLoader = "1";
    script.defer = true;
    (document.body || document.documentElement).appendChild(script);
  }

  onReady(function () {
    document.documentElement.classList.add("js-boot");
    loadAssistant();
  });

  if (location.protocol === "file:") {
    onReady(function () {
      dismissPreloader();
      showWarning(
        "<strong style='color:#d4af37;font-size:1.25rem;display:block;margin-bottom:12px;'>Сайт нельзя открывать двойным кликом по index.html</strong>" +
          "Этот проект использует ES-модули — браузер блокирует их через <code>file://</code>.<br><br>" +
          "<strong>Как открыть:</strong><br>" +
          "1. Закройте эту вкладку<br>" +
          "2. Дважды кликните файл <strong>START.bat</strong> в папке сайта<br>" +
          "3. Откроется ссылка <a href='http://127.0.0.1:5501/' style='color:#d4af37'>http://127.0.0.1:5501/</a>"
      );
    });
    return;
  }

  setTimeout(function () {
    if (!document.body.classList.contains("is-loading")) return;

    dismissPreloader();
    showWarning(
      "<strong style='color:#d4af37;font-size:1.25rem;display:block;margin-bottom:12px;'>Скрипты не загрузились</strong>" +
        "Возможные причины: нет интернета (нужен CDN GSAP/Lenis) или страница открыта не через сервер.<br><br>" +
        "Запустите <strong>START.bat</strong> и откройте " +
        "<a href='http://127.0.0.1:5501/' style='color:#d4af37'>http://127.0.0.1:5501/</a>"
    );
  }, 12000);
})();