@echo off
echo Checking services...
echo.
echo Frontend (port 3000):
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do echo   PID: %%a - Running
echo Backend (port 4000):
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do echo   PID: %%a - Running
echo.
echo Public URL:
if exist C:\Users\ASUS\AppData\Local\Temp\opencode\lt-url.txt (
  type C:\Users\ASUS\AppData\Local\Temp\opencode\lt-url.txt
) else (
  echo   No tunnel running
)
echo.
echo To start everything, double-click start-all.vbs
pause
