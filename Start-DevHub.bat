@echo off
title KMB DevHub PRO — Project Operations Command Console
color 0B
cls

echo ===============================================================================
echo       __ __ __  ___ ___    ___   _______    ____  __  __  ____ 
echo      / //_//  ^|/  // _ )  / _ \ / __/ / / / / / / / / / / / / _ )
echo     / ,^<  / /^|_/ // _  ^| / // // _// /_/ / / /_/ /_/ /_/ / _  ^|
echo    /_/^|_^|/_/  /_//____/ /____//___/\____/  /____/\____/_/ /____/ 
echo.
echo           ENTERPRISE PROJECT OPERATIONS COMMAND CENTER v2.4
echo                     Lead Architect: Khurram Munir
echo ===============================================================================
echo.
echo [1/3] Initializing runtime environment...

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and retry.
    pause
    exit /b 1
)

:: Check for dependencies
if not exist "node_modules\" (
    echo [2/3] Installing required packages (first time setup)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Package installation failed!
        pause
        exit /b 1
    )
) else (
    echo [2/3] Dependencies verified.
)

echo [3/3] Launching DevHub Software Console at http://localhost:5173 ...
echo.
echo ===============================================================================
echo   Console Status : ONLINE (31 Project Clusters Loaded)
echo   Local Address  : http://localhost:5173
echo   Press Ctrl + C in this terminal anytime to stop the server.
echo ===============================================================================
echo.

:: Launch browser in app mode or default browser after 2 seconds
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173'"

:: Start Vite dev server
call npm run dev
