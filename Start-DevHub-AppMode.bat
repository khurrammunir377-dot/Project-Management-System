@echo off
title KMB DevHub PRO — Standalone Software Runner
color 0B
cls

echo [1/2] Starting DevHub Backend Service...
start /b cmd /c "npm run dev"

echo [2/2] Launching in Desktop App Window...
timeout /t 2 /nobreak >nul

:: Try Chrome App Mode
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://localhost:5173" --window-size=1400,900
    goto :done
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="http://localhost:5173" --window-size=1400,900
    goto :done
)

:: Try Microsoft Edge App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://localhost:5173" --window-size=1400,900
    goto :done
)

:: Fallback to default browser
start http://localhost:5173

:done
echo DevHub is running in Desktop Mode.
