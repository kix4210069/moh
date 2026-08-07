@echo off
REM Double-cliquez sur ce fichier pour lancer le CRM (Windows).
cd /d "%~dp0"
title CRM Formation

echo ===============================================
echo         CRM Formation - demarrage
echo ===============================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo   Node.js n'est pas installe.
  echo   1^) Allez sur https://nodejs.org
  echo   2^) Telechargez la version "LTS" et installez-la
  echo   3^) Relancez ce fichier
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo   Premiere installation ^(1 a 2 minutes^)...
  call npm install
  if errorlevel 1 ( echo Echec de l'installation. & pause & exit /b 1 )
)

echo   Le CRM va s'ouvrir dans votre navigateur.
echo   Adresse : http://localhost:3000
echo   Connexion : admin@centre.fr  /  admin1234
echo.
echo   ^>^> Laissez cette fenetre OUVERTE tant que vous utilisez le CRM.
echo   ^>^> Pour arreter : fermez cette fenetre.
echo.

start "" http://localhost:3000
call npm start
pause
