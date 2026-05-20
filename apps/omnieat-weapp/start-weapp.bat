@echo off
title Dapoer WeChat Mini Program - Build & Launcher
color 0A

:: Store the script's directory as the root
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%
set BACKEND_DIR=%PROJECT_ROOT%backend

echo ===================================================
echo         DAPOER WECHAT MINI PROGRAM
echo           Build & Development Launcher
echo ===================================================
echo.

:: 1. Convert SVG Icons to PNG
echo [1/4] Converting tabBar icons to PNG format...
cd /d "%PROJECT_ROOT%"
node convert-icons.js
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Icon conversion failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.

:: 2. Build WeChat Mini Program Frontend
echo [2/4] Compiling WeChat Mini Program (weapp) assets...
cd /d "%PROJECT_ROOT%"
call npm run build:weapp
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] WeApp compilation failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.

:: 3. Synchronize Database Schema
echo [3/4] Synchronizing Prisma database schema...
cd /d "%BACKEND_DIR%"
call npx prisma db push
set PRISMA_EXIT=%ERRORLEVEL%
cd /d "%PROJECT_ROOT%"
if %PRISMA_EXIT% neq 0 (
    color 0C
    echo [ERROR] Database sync failed! Check backend dependencies.
    pause
    exit /b %PRISMA_EXIT%
)
echo [SUCCESS] Database synced!
echo.

:: 4. Check backend status
echo [4/4] Checking backend status...
netstat -an | find "LISTENING" | find ":3001" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [INFO] Backend is RUNNING on port 3001
    set BACKEND_RUNNING=1
) else (
    echo [INFO] Backend is NOT running on port 3001
    echo [WARNING] Make sure to start backend manually before testing
    set BACKEND_RUNNING=0
)
echo.

:: 5. Copy PNG Icons to Dist
echo [5/5] Copying PNG icons to dist folder...
cd /d "%PROJECT_ROOT%"
if not exist "dist\assets\icons" mkdir dist\assets\icons
xcopy /Y /I src\assets\icons\*.png dist\assets\icons\ >nul 2>&1
echo.

:: 5. Final message
cd /d "%PROJECT_ROOT%"
echo.
echo ===================================================
echo  BUILD COMPLETE!
echo  - WeApp Dist: %PROJECT_ROOT%dist
echo  - Backend API: http://localhost:3001
echo ===================================================
echo.
if %BACKEND_RUNNING%==0 (
    echo ⚠️  BACKEND STATUS: NOT RUNNING
    echo.
    echo Please start backend manually in a SEPARATE command window:
    echo ===================================================
    echo   cd /d "%BACKEND_DIR%"
    echo   npx next dev -p 3001
    echo ===================================================
    echo.
) else (
    echo ✅ BACKEND STATUS: RUNNING
    echo.
)
echo INSTRUCTIONS:
echo 1. Open WeChat DevTools
echo 2. Import project from: %PROJECT_ROOT%dist
echo 3. Enable "Don't check valid domain names" in Settings
echo 4. Add localhost to request whitelist if needed
echo.
echo ===================================================
echo You are running TWO windows:
echo   1. This window (build only - close when done)
echo   2. Your backend window (keep running for testing)
echo ===================================================
pause