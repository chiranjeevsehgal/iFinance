@echo off
echo ========================================
echo Frontend Environment Setup
echo ========================================
echo.

cd /d "%~dp0src\environments"

:: Check if environment.ts already exists
if exist "environment.ts" (
    echo [INFO] environment.ts already exists
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto skipdev
)

echo [SETUP] Creating environment.ts from template...
copy /Y "environment.template.ts" "environment.ts" >nul
if %errorlevel% equ 0 (
    echo [OK] environment.ts created successfully
) else (
    echo [ERROR] Failed to create environment.ts
    goto error
)

:skipdev

:: Check if environment.prod.ts already exists
if exist "environment.prod.ts" (
    echo [INFO] environment.prod.ts already exists
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto skipprod
)

echo [SETUP] Creating environment.prod.ts from template...
copy /Y "environment.prod.template.ts" "environment.prod.ts" >nul
if %errorlevel% equ 0 (
    echo [OK] environment.prod.ts created successfully
) else (
    echo [ERROR] Failed to create environment.prod.ts
    goto error
)

:skipprod

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Environment files created in src/environments/
echo - environment.ts (development)
echo - environment.prod.ts (production)
echo.
echo Next steps:
echo 1. Review and update the files if needed
echo 2. Run: npm install
echo 3. Run: npm start
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Setup failed!
pause
exit /b 1
