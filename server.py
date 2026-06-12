#!/usr/bin/env python3
"""Static server + Gemini chat proxy (ключ только на сервере)."""
from __future__ import annotations

import http.server
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

PORT = 5501
ROOT = Path(__file__).resolve().parent
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

SYSTEM_PROMPT = """Ты — AI-ассистент сайта «Александра Волкова · Private Capital».
Помогаешь посетителям с вопросами о капитале, инвестициях, услугах, курсе осознанности и записи на бесплатную диагностику 30 минут.
Отвечай на русском языке, кратко и по делу, тёплым профессиональным тоном.
Контакты: Telegram @alexavolkova, телефон +31622912016, запись — страница «Отзывы», раздел контактов.
Не выдумывай точные цифры доходности. Если вопрос вне темы сайта — вежливо перенаправь."""


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


load_env()
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


class SiteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_OPTIONS(self) -> None:
        if self.path == "/api/chat":
            self.send_response(204)
            self._cors()
            self.end_headers()
            return
        self.send_error(404)

    def do_POST(self) -> None:
        if self.path == "/api/chat":
            self.handle_chat()
            return
        self.send_error(404)

    def handle_chat(self) -> None:
        if not API_KEY:
            self.send_json(500, {"error": "GEMINI_API_KEY не задан в .env"})
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            messages = body.get("messages", [])
            if not messages:
                self.send_json(400, {"error": "Пустое сообщение"})
                return

            contents = []
            for msg in messages[-20:]:
                text = str(msg.get("text", "")).strip()
                if not text:
                    continue
                role = "user" if msg.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": text}]})

            if not contents:
                self.send_json(400, {"error": "Нет текста для отправки"})
                return

            if contents[0]["role"] != "user":
                contents.insert(0, {"role": "user", "parts": [{"text": "Привет"}]})

            payload = {
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.65,
                    "maxOutputTokens": 1024,
                },
            }

            url = f"{GEMINI_BASE}/{MODEL}:generateContent"
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY,
                },
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=90) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            candidates = data.get("candidates") or []
            if not candidates:
                self.send_json(502, {"error": "Пустой ответ от Gemini"})
                return

            parts = candidates[0].get("content", {}).get("parts") or []
            reply = "".join(p.get("text", "") for p in parts).strip()
            if not reply:
                self.send_json(502, {"error": "Модель не вернула текст"})
                return

            self.send_json(200, {"reply": reply, "model": MODEL})

        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            self.send_json(exc.code, {"error": detail or exc.reason})
        except Exception as exc:  # noqa: BLE001
            self.send_json(500, {"error": str(exc)})

    def send_json(self, code: int, payload: dict) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, fmt: str, *args) -> None:
        if str(args[0]).startswith("POST /api/chat"):
            super().log_message(fmt, *args)
            return
        if str(args[1]) != "200" and not str(args[0]).endswith((".js", ".css", ".html", ".jpg", ".jpeg", ".png", ".webp", ".svg", ".ico")):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), SiteHandler) as httpd:
        print(f"Сервер: http://127.0.0.1:{PORT}/")
        print(f"Модель: {MODEL}")
        print("Чат-бот: /api/chat")
        httpd.serve_forever()