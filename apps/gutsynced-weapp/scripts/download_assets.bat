@echo off
REM Figma Asset Downloader - Quick Start
REM =====================================

echo ======================================================================
echo   Figma Asset Downloader - Quick Start
echo ======================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found
echo.

REM Check if requests library is installed
python -c "import requests" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing required dependencies...
    pip install requests
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [OK] Dependencies installed
echo.

REM Ask user which script to run
echo Which downloader would you like to use?
echo.
echo 1. Advanced Downloader (RECOMMENDED)
echo    - Better categorization
echo    - SVG support
echo    - Smarter rate limiting
echo.
echo 2. Basic Downloader
echo    - Simple and straightforward
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Starting Advanced Downloader...
    echo.
    python download_figma_assets_advanced.py
) else if "%choice%"=="2" (
    echo.
    echo Starting Basic Downloader...
    echo.
    python download_figma_assets.py
) else (
    echo.
    echo [ERROR] Invalid choice. Please run again and select 1 or 2.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo   Download complete!
echo ======================================================================
echo.
echo Check the output folder: D:\Liberary\Taro\apps\food\assets\figma
echo.
pause
