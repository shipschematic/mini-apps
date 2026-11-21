@echo off
title GutSynced_WeChat_Mini_Program_-_Build_Launcher
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

:: Check if convert-icons.js exists, if not, skip or create placeholder
if not exist "%PROJECT_ROOT%convert-icons.js" (
    echo [WARNING] convert-icons.js not found, creating placeholder...
    (
        echo // Placeholder for icon conversion
        echo const fs = require('fs'^);
        echo const path = require('path'^);
        echo.
        echo console.log('Icon conversion script - placeholder'^);
        echo console.log('Make sure to implement actual SVG to PNG conversion'^);
        echo.
        echo // Create icons directory if needed
        echo const iconsDir = path.join(__dirname, 'src', 'assets', 'icons'^);
        echo if (!fs.existsSync(iconsDir^)^) {
        echo     fs.mkdirSync(iconsDir, { recursive: true }^);
        echo }
    ) > "%PROJECT_ROOT%convert-icons.js"
    echo [INFO] Placeholder created at %PROJECT_ROOT%convert-icons.js
    echo.
)

:: 1. Convert SVG Icons to PNG
echo [1/5] Converting tabBar icons to PNG format...
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
echo [2/5] Compiling WeChat Mini Program (weapp) assets...
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
echo [3/5] Synchronizing Prisma database schema...
if exist "%BACKEND_DIR%" (
    cd /d "%BACKEND_DIR%"
    if exist "node_modules\prisma" (
        call npx prisma db push
        set PRISMA_EXIT=%ERRORLEVEL%
    ) else (
        echo [WARNING] Prisma not found in backend. Run: npm install
        set PRISMA_EXIT=1
    )
    cd /d "%PROJECT_ROOT%"
    if %PRISMA_EXIT% neq 0 (
        color 0C
        echo [ERROR] Database sync failed! Check backend dependencies.
        pause
        exit /b %PRISMA_EXIT%
    )
    echo [SUCCESS] Database synced!
) else (
    echo [WARNING] Backend directory not found: %BACKEND_DIR%
)
echo.

:: 4. Check backend status
echo [4/5] Checking backend status...
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
if exist "src\assets\icons\*.png" (
    xcopy /Y /I src\assets\icons\*.png dist\assets\icons\ >nul 2>&1
    echo [INFO] PNG icons copied
) else (
    echo [INFO] No PNG icons found in src\assets\icons
)
echo.

:: Final message
cd /d "%PROJECT_ROOT%"
echo.
echo ===================================================
echo  BUILD COMPLETE!
echo  - WeApp Dist: %PROJECT_ROOT%dist
echo  - Backend API: http://localhost:3001
echo ===================================================
echo.
if %BACKEND_RUNNING%==0 (
    echo [WARNING] BACKEND STATUS: NOT RUNNING
    echo.
    echo Please start backend manually in a SEPARATE command window:
    echo ===================================================
    echo   cd /d "%BACKEND_DIR%"
    echo   npx next dev -p 3001
    echo ===================================================
    echo.
) else (
    echo [SUCCESS] BACKEND STATUS: RUNNING
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