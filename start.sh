#!/bin/bash

# StreamHub Startup Script

echo "🎬 Starting StreamHub..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Start the application
echo "🚀 Starting StreamHub on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

python app.py
