@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Александра Волкова — локальный сервер

echo.
echo  ============================================
echo   Private Capital — локальный сервер
echo  ============================================
echo.
echo  Сайт откроется в браузере:
echo  http://127.0.0.1:5501/
echo.
echo  НЕ закрывайте это окно, пока смотрите сайт.
echo  Для остановки нажмите Ctrl+C
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5501" ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

start "" "http://127.0.0.1:5501/"
python server.py
if errorlevel 1 (
  echo.
  echo  Ошибка запуска. Убедитесь, что установлен Python.
  echo  Скачать: https://www.python.org/downloads/
  pause
)