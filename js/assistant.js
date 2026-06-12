(function () {
  "use strict";

  const SHELL_HTML = `
<div id="assistant-root" class="assistant-root" data-assistant-mounted="1">
  <div class="assistant-aurora" aria-hidden="true"></div>
  <div class="assistant-panel" id="assistant-panel" role="dialog" aria-label="AI-ассистент" aria-hidden="true">
    <div class="assistant-panel__mesh" aria-hidden="true"></div>
    <div class="assistant-panel__scan" aria-hidden="true"></div>
    <div class="assistant-panel__head">
      <div class="assistant-panel__avatar" aria-hidden="true">
        <span class="assistant-panel__avatar-orbit"></span>
        <span class="assistant-panel__avatar-ring"></span>
        <svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.07A7.001 7.001 0 0 1 5.07 19H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2zm-5 15a5 5 0 0 0 10 0H7z"/></svg>
      </div>
      <div class="assistant-panel__meta">
        <p class="assistant-panel__title">Ассистент Private Capital</p>
        <p class="assistant-panel__sub">онлайн</p>
      </div>
      <button type="button" class="assistant-panel__close" id="assistant-close" aria-label="Закрыть чат">×</button>
    </div>
    <div class="assistant-panel__prompts" id="assistant-prompts">
      <button type="button" class="assistant-prompt" data-prompt="С чего начать работу с капиталом?">С чего начать</button>
      <button type="button" class="assistant-prompt" data-prompt="Какие услуги вы предлагаете?">Услуги</button>
      <button type="button" class="assistant-prompt" data-prompt="Расскажи о курсе осознанности">Курс</button>
    </div>
    <div class="assistant-panel__messages" id="assistant-messages" role="log" aria-live="polite"></div>
    <form class="assistant-panel__form" id="assistant-form">
      <textarea class="assistant-panel__input" id="assistant-input" rows="1" placeholder="Спросите о капитале, услугах, курсе…" maxlength="2000"></textarea>
      <button type="submit" class="assistant-panel__send" id="assistant-send" aria-label="Отправить">
        <svg viewBox="0 0 24 24"><path d="M3.4 20.4l17.45-7.6c.81-.35.81-1.49 0-1.84L3.4 3.6c-.78-.34-1.58.46-1.32 1.27l2.05 6.63c.1.33.38.56.72.56H11v2H4.85c-.34 0-.62.23-.72.56l-2.05 6.63c-.26.81.54 1.61 1.32 1.27z"/></svg>
      </button>
    </form>
  </div>
  <button type="button" class="assistant-fab" id="assistant-fab" aria-label="Открыть AI-ассистента" aria-expanded="false" aria-controls="assistant-panel">
    <span class="assistant-fab__halo" aria-hidden="true"></span>
    <span class="assistant-fab__pulse" aria-hidden="true"></span>
    <span class="assistant-fab__orbit" aria-hidden="true"></span>
    <span class="assistant-fab__core">
      <span class="assistant-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M9.5 7A3.5 3.5 0 0 1 13 3.5h0A3.5 3.5 0 0 1 16.5 7v.2c1.8.5 3 2.1 3 4v4.3c0 .8-.7 1.5-1.5 1.5H6c-.8 0-1.5-.7-1.5-1.5V11.2c0-1.9 1.2-3.5 3-4V7zm3.5-2A2 2 0 0 0 11 7h2a2 2 0 0 0-2-2zm-1 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
      </span>
      <span class="assistant-fab__spark" aria-hidden="true"></span>
    </span>
    <span class="assistant-fab__copy">
      <span class="assistant-fab__label">AI</span>
      <span class="assistant-fab__hint">Ассистент</span>
    </span>
  </button>
</div>`;

  function mountShell() {
    let root = document.getElementById("assistant-root");

    if (!root) {
      const wrap = document.createElement("div");
      wrap.innerHTML = SHELL_HTML.trim();
      root = wrap.firstElementChild;
      document.body.appendChild(root);
    } else if (root.dataset.assistantMounted !== "1") {
      const wrap = document.createElement("div");
      wrap.innerHTML = SHELL_HTML.trim();
      const fresh = wrap.firstElementChild;
      root.replaceWith(fresh);
      root = fresh;
    }

    document.body.appendChild(root);
    return root;
  }

  function initAssistant() {
    const root = mountShell();
    if (root.dataset.bound === "1") return;

    root.dataset.bound = "1";
    document.body.classList.add("has-assistant");

    const panel = document.getElementById("assistant-panel");
    const fab = document.getElementById("assistant-fab");
    const closeBtn = document.getElementById("assistant-close");
    const messagesEl = document.getElementById("assistant-messages");
    const promptsEl = document.getElementById("assistant-prompts");
    const form = document.getElementById("assistant-form");
    const input = document.getElementById("assistant-input");
    const sendBtn = document.getElementById("assistant-send");

    if (!panel || !fab || !messagesEl || !form || !input) return;

    let isOpen = false;
    let isLoading = false;
    const history = [];

    const welcome =
      "Здравствуйте! Я ассистент Александры Волкова · Private Capital. Помогу с капиталом, инвестициями, услугами, курсом осознанности и записью на диагностику.";

    function appendMessage(text, type) {
      const el = document.createElement("div");
      el.className = `assistant-msg assistant-msg--${type}`;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      if (promptsEl && messagesEl.children.length > 1) {
        promptsEl.classList.add("is-hidden");
      }
    }

    function appendTyping() {
      const el = document.createElement("div");
      el.className = "assistant-msg assistant-msg--typing";
      el.id = "assistant-typing";
      el.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      document.getElementById("assistant-typing")?.remove();
    }

    function setOpen(open) {
      isOpen = open;
      panel.classList.toggle("is-open", open);
      fab.classList.toggle("is-open", open);
      root.classList.toggle("is-open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        input.focus();
        if (!messagesEl.children.length) appendMessage(welcome, "bot");
      }
    }

    async function sendMessage(text) {
      if (!text.trim() || isLoading) return;

      const userText = text.trim();
      input.value = "";
      appendMessage(userText, "user");
      history.push({ role: "user", text: userText });

      isLoading = true;
      sendBtn.disabled = true;
      appendTyping();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        const data = await res.json().catch(() => ({}));
        removeTyping();

        if (!res.ok) {
          const err = data.error || `Ошибка ${res.status}`;
          appendMessage(typeof err === "string" ? err.slice(0, 280) : "Ошибка сервера.", "error");
          history.pop();
          return;
        }

        appendMessage(data.reply || "Пустой ответ.", "bot");
        history.push({ role: "model", text: data.reply });
      } catch {
        removeTyping();
        appendMessage("Нет связи. Запустите START.bat.", "error");
        history.pop();
      } finally {
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }

    fab.addEventListener("click", () => setOpen(!isOpen));
    closeBtn?.addEventListener("click", () => setOpen(false));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) setOpen(false);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage(input.value);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });

    promptsEl?.addEventListener("click", (e) => {
      const btn = e.target.closest(".assistant-prompt");
      if (!btn) return;
      sendMessage(btn.dataset.prompt || btn.textContent);
    });

    requestAnimationFrame(() => root.classList.add("is-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAssistant);
  } else {
    initAssistant();
  }
})();