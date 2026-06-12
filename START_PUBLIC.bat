@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Private Capital — сервер + публичная ссылка

echo.
echo  ============================================
echo   Private Capital — сервер + публичный доступ
echo  ============================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5501" ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo  Запуск локального сервера...
start "PC Server" /MIN cmd /c "cd /d "%~dp0" && python server.py"
timeout /t 2 /nobreak >nul

echo  Запуск публичного туннеля Cloudflare...
start "PC Tunnel" cmd /k "cd /d "%~dp0" && cloudflared tunnel --url http://127.0.0.1:5501"

echo.
echo  Локально:  http://127.0.0.1:5501/
echo  Публичная ссылка появится в окне "PC Tunnel" через ~10 сек.
echo  Также смотрите файл PUBLIC_URL.txt после обновления.
echo.
echo  НЕ закрывайте окна PC Server и PC Tunnel.
echo.

start "" "http://127.0.0.1:5501/"
pause