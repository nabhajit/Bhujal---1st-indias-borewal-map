@echo off
echo Starting BHUJAL MERN Application...
echo.

echo Starting MongoDB (if installed as service)...
net start MongoDB

echo.
echo Starting Backend Server...
start "BHUJAL Backend" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "BHUJAL Frontend" cmd /k "cd frontend && npm start"

echo.
echo Application is starting up...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
pause
