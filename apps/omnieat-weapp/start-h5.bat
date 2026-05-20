@echo off
title Dapoer Monorepo - Quick Launcher
color 0A

echo ===================================================
echo             DAPOER FOOD RECIPE APP
echo           Automated Startup Launcher
echo ===================================================
echo.

:: 1. Build H5 Frontend
echo [1/5] Compiling premium frontend H5 assets...
call npm run build:h5
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Frontend compilation failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.

:: 2. Ensure Database is Synchronized
echo [2/5] Synchronizing Prisma SQLite schema...
cd backend
call npx prisma db push
cd ..
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Database synchronization failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.

:: 3. Start Next.js Backend API
echo [3/5] Launching Backend API Server on port 3000...
start "Dapoer Backend API" cmd /c "cd backend && npm run dev"
echo.

:: 4. Start Static Frontend Server
echo [4/5] Launching Frontend Web Server on port 5000...
start "Dapoer Frontend Web" cmd /c "npx serve -s dist -p 5000"
echo.

:: 5. Open Browser
echo [5/5] Launching browser to sign-up screen...
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak > nul

start http://localhost:5000/#/pages/sign-up/index

echo.
echo ===================================================
echo  LAUNCH SUCCESSFUL! 
echo  - Backend API: http://localhost:3000
echo  - Frontend App: http://localhost:5000
echo ===================================================
echo.
pause
