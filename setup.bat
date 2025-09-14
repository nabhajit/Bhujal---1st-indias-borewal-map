@echo off
echo Setting up BHUJAL MERN Application...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo Backend dependencies installed!
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo Frontend dependencies installed!
echo.

echo Creating .env file for backend...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo .env file created! Please update it with your configuration.
) else (
    echo .env file already exists.
)
echo.

echo Setup complete! 
echo.
echo To start the application:
echo 1. Start MongoDB service
echo 2. Backend: cd backend && npm run dev
echo 3. Frontend: cd frontend && npm start
echo.
pause
