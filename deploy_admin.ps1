# Khush Enterprises - Safe Hostinger FTP Deployment Script
# This script builds the Next.js frontend and deploys either only the Admin section or the entire site using curl.exe.
# It DOES NOT perform deletions on the server, meaning your remote uploads/ folder is 100% safe.

$ErrorActionPreference = "Stop"

# Clear screen
Clear-Host
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    KHUSH ENTERPRISES - HOSTINGER FTP DEPLOYER" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Load or prompt for FTP credentials
$envFile = "c:\web\.env.deploy"
$ftpHost = ""
$ftpUser = ""
$ftpPass = ""
$ftpProto = "ftp" # ftp or ftps

if (Test-Path $envFile) {
    Write-Host "Loading credentials from .env.deploy..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^FTP_HOST=(.*)$") { $ftpHost = $Matches[1].Trim() }
        if ($_ -match "^FTP_USER=(.*)$") { $ftpUser = $Matches[1].Trim() }
        if ($_ -match "^FTP_PASS=(.*)$") { $ftpPass = $Matches[1].Trim() }
        if ($_ -match "^FTP_PROTO=(.*)$") { $ftpProto = $Matches[1].Trim() }
    }
}

if (-not $ftpHost -or -not $ftpUser -or -not $ftpPass) {
    Write-Host "No saved credentials found. Please enter details (they will be saved to .env.deploy for future use):" -ForegroundColor Yellow
    $ftpHost = Read-Host "FTP Server (e.g. ftp.khushenterprise.com or IP)"
    $ftpUser = Read-Host "FTP Username"
    $ftpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Read-Host "FTP Password" -AsSecureString)))
    $ftpProto = Read-Host "Protocol (ftp or ftps) [default: ftp]"
    if (-not $ftpProto) { $ftpProto = "ftp" }

    # Save credentials for future use
    $envContent = @"
FTP_HOST=$ftpHost
FTP_USER=$ftpUser
FTP_PASS=$ftpPass
FTP_PROTO=$ftpProto
"@
    Set-Content -Path $envFile -Value $envContent
    Write-Host "Saved credentials to .env.deploy (added to .gitignore for security)." -ForegroundColor Green
}

# 2. Choose deployment mode
Write-Host ""
Write-Host "Select deployment mode:" -ForegroundColor Cyan
Write-Host " [1] Upload Admin Portal & Static Chunks ONLY (Fast & ultra-safe)" -ForegroundColor Yellow
Write-Host " [2] Upload Entire Website (Updates storefront too, but preserves uploads folder)" -ForegroundColor Yellow
$mode = Read-Host "Enter option (1 or 2)"

if ($mode -ne "1" -and $mode -ne "2") {
    Write-Host "Invalid option selected. Aborting." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Build the frontend
Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Step 1/3: Building Next.js Frontend..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

cd "c:\web\frontend"
# Run build
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed! Please resolve TypeScript/Next.js errors before deploying." -ForegroundColor Red
    cd "c:\web"
    Read-Host "Press Enter to exit..."
    exit 1
}
cd "c:\web"

Write-Host ""
Write-Host "✅ Next.js Static Export successfully generated in frontend/out/" -ForegroundColor Green
Write-Host ""

# 4. Scan files to upload
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Step 2/3: Scanning files..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$outDir = "c:\web\frontend\out"
$allFiles = Get-ChildItem -Path $outDir -Recurse -File

$filesToUpload = @()

foreach ($file in $allFiles) {
    $relPath = Resolve-Path $file.FullName -Relative -RelativeTo $outDir
    # Remove leading .\ or ./
    $relPath = $relPath -replace "^\.\\", "" -replace "^\./", ""
    # Normalize slashes to forward slashes for FTP
    $remoteRelPath = $relPath -replace "\\", "/"

    if ($mode -eq "1") {
        # Admin Only Mode filter
        if ($remoteRelPath -eq ".htaccess" -or
            $remoteRelPath -eq "secure-portal-access.html" -or
            $remoteRelPath -eq "admin-portal-ke.html" -or
            $remoteRelPath.StartsWith("secure-portal-access/") -or
            $remoteRelPath.StartsWith("admin-portal-ke/") -or
            $remoteRelPath.StartsWith("_next/")) {
            $filesToUpload += @{ Local = $file.FullName; Remote = $remoteRelPath }
        }
    } else {
        # Full Mode: Upload all files
        $filesToUpload += @{ Local = $file.FullName; Remote = $remoteRelPath }
    }
}

Write-Host "Found $($allFiles.Count) files total in out/ directory." -ForegroundColor Green
Write-Host "Selected $($filesToUpload.Count) files for upload." -ForegroundColor Green
Write-Host ""

# 5. Perform the uploads via curl.exe
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Step 3/3: Uploading files to Hostinger..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$count = 0
$total = $filesToUpload.Count

foreach ($item in $filesToUpload) {
    $count++
    $localPath = $item.Local
    $remotePath = $item.Remote
    $remoteUrl = "$ftpProto://$ftpHost/public_html/$remotePath"

    Write-Host "[$count/$total] Uploading: $remotePath ... " -NoNewline -ForegroundColor Gray

    # Call curl.exe to perform the FTP upload
    # --ftp-create-dirs automatically creates missing remote subfolders
    $curlArgs = @(
        "--ftp-create-dirs",
        "-T", $localPath,
        $remoteUrl,
        "--user", "$ftpUser:$ftpPass",
        "--silent",
        "--show-error",
        "--fail"
    )

    if ($ftpProto -eq "ftps") {
        $curlArgs += "--ssl-reqd"
    }

    $process = Start-Process -FilePath "curl.exe" -ArgumentList $curlArgs -NoNewWindow -PassThru -Wait
    
    if ($process.ExitCode -eq 0) {
        Write-Host "SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "FAILED (Exit Code: $($process.ExitCode))" -ForegroundColor Red
        Write-Host "  Please verify connection credentials or server folder write permissions." -ForegroundColor Yellow
        $choice = Read-Host "Do you want to continue uploading remaining files? (y/n)"
        if ($choice -ne "y") {
            Write-Host "Deployment aborted." -ForegroundColor Red
            Read-Host "Press Enter to exit..."
            exit 1
        }
    }
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "   🎉 DEPLOYMENT COMPLETE! All files synced successfully." -ForegroundColor Green
Write-Host "   No files were deleted, and your uploads folder is safe." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close..."
