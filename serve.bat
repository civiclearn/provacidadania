@echo off
REM Simple local static server for Windows (Python required)

REM Change to the folder where this .bat file is located
cd /d "%~dp0"

REM Try Python launcher first (recommended on Windows)
where py >nul 2>&1
if %errorlevel%==0 (
  echo Starting local server at http://localhost:8000
  py -m http.server 8000
  goto :eof
)

REM Fallback to python command
where python >nul 2>&1
if %errorlevel%==0 (
  echo Starting local server at http://localhost:8000
  python -m http.server 8000
  goto :eof
)

echo Python is not installed or not in PATH.
echo Install Python from https://www.python.org/ and try again.
pause
