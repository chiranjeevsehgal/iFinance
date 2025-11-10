@echo off
REM Setup script for iFinance backend environment

echo ========================================
echo iFinance Backend Environment Setup
echo ========================================
echo.

REM Check if .env already exists
if exist .env (
    echo .env file already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto :end
    if errorlevel 1 goto :create
) else (
    goto :create
)

:create
echo.
echo Creating .env file from template...
copy .env.example .env >nul

if errorlevel 1 (
    echo Error: Could not create .env file
    echo Make sure .env.example exists
    goto :end
)

echo.
echo ✓ .env file created successfully!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Edit the .env file with your credentials:
echo    notepad .env
echo.
echo 2. You need to provide:
echo    - MongoDB Atlas connection string
echo    - Google OAuth2 Client ID
echo    - Google OAuth2 Client Secret
echo.
echo 3. See ENV_SETUP.md for detailed instructions
echo.
echo 4. After updating .env, run:
echo    mvn spring-boot:run
echo.
echo ========================================

choice /C YN /M "Do you want to open .env file now"
if errorlevel 2 goto :end
if errorlevel 1 notepad .env

:end
echo.
echo Done!
pause
