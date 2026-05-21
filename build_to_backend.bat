@echo off
echo ===================================================
echo   Building Frontend and Copying to Backend
echo ===================================================
echo.

echo 1/3: Building Next.js Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b %errorlevel%
)
cd ..

echo.
echo 2/3: Cleaning Backend Public Directory...
if not exist "backend\public" mkdir "backend\public"
if exist "backend\public\uploads" (
    echo Saving uploads folder...
    move "backend\public\uploads" "backend\uploads_temp" >nul 2>&1
)
del /q /s "backend\public\*" >nul 2>&1
for /d %%p in ("backend\public\*") do rmdir "%%p" /s /q >nul 2>&1
if exist "backend\uploads_temp" (
    echo Restoring uploads folder...
    move "backend\uploads_temp" "backend\public\uploads" >nul 2>&1
)

echo.
echo 3/3: Copying Frontend Build to Backend...
xcopy /e /k /h /i "frontend\out\*" "backend\public" >nul 2>&1

echo.
echo ===================================================
echo   DONE! Frontend is now integrated into the Backend.
echo   You can now push these files to GitHub.
echo ===================================================
pause
