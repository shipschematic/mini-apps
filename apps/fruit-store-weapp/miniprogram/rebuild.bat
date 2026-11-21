@echo off
pushd "%~dp0"

echo Deleting dist folder...
if exist dist (
    rd /s /q dist
    echo dist deleted.
) else (
    echo No dist folder found.
)

echo.
echo Building WeChat Mini Program...
call npm run build:weapp

echo.
echo Done.
pause
