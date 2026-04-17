@echo off
echo ========================================
echo  Clean Build Script for Taro WeChat
echo ========================================
echo.

:: Kill WeChat DevTools if running
echo [1/4] Closing WeChat DevTools...
taskkill /F /IM wechatdevtools.exe 2>nul
timeout /t 2 /nobreak >nul

:: Delete dist folder
echo [2/4] Deleting dist folder...
if exist "dist" (
    rd /s /q "dist"
    echo    Done.
) else (
    echo    Already deleted.
)

:: Run build
echo [3/4] Running build...
call npm run build:weapp

echo.
echo ========================================
echo  Build complete! 
echo  Open WeChat DevTools and import dist/
echo ========================================
pause
