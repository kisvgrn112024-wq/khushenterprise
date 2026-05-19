@echo off
title Khush Enterprises - Automated GitHub Sync
echo ===================================================
echo   KHUSH ENTERPRISES - AUTOMATED GITHUB SYNC
echo ===================================================
echo.
cd /d "c:\web"
echo [1/4] Checking repository status...
git status
echo.
echo [2/4] Staging newly built pipeline updates...
git add .
echo.
echo [3/4] Committing unified database catalog mappings...
git commit -m "feat: complete unified category inventory tracking and dynamic PDF catalog mapping pipeline"
echo.
echo [4/4] Pushing committed codebase to remote GitHub repository...
git push
echo.
echo ===================================================
echo   SYNC COMPLETE! You can close this window now.
echo ===================================================
pause
