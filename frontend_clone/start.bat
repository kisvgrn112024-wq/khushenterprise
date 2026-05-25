@echo off
echo ===================================================
echo   Starting Khush Enterprises Website...
echo ===================================================
echo.
echo The website will automatically open in your browser shortly!
echo Keep this window open to keep the server running.
echo.
start http://localhost:3000
call npm run dev
