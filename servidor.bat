@echo off
title Edupuente - Servidor Backend
cd /d "%~dp0src\backend"
echo ================================================
echo Edupuente - Servidor Backend
echo ================================================
echo.
if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
  echo.
)
echo Iniciando servidor en http://localhost:3000
echo Abre: public/login.html o public/index.html
echo Presiona Ctrl+C para detener
echo.
node server.js
pause
