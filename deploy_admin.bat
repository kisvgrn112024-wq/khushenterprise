@echo off
title Hostinger FTP Deployer - Khush Enterprises
echo Launching Deployment Script...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy_admin.ps1"
pause
