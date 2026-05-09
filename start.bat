@echo off
REM StreamHub Startup Script for Windows

echo 🎬 Starting StreamHub...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📥 Installing dependencies...
pip install -q -r requirements.txt

REM Start the application
echo 🚀 Starting StreamHub on http://localhost:5000
echo Press Ctrl+C to stop
echo.

python app.py
