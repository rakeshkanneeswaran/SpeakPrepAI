#!/bin/bash
# ==========================================
# 🚀 FastAPI Startup Script for Interview AI
# ==========================================

# Activate your virtual environment (optional)
# Replace with your venv path if you use one
if [ -d "venv" ]; then
  source venv/bin/activate
elif [ -d ".venv" ]; then
  source .venv/bin/activate
elif command -v poetry &>/dev/null && [ -n "$(poetry env info --path 2>/dev/null)" ]; then
  source "$(poetry env info --path)/bin/activate"
fi

# Load environment variables from .env if it exists
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 🧠 Force Python to print logs immediately (no buffering)
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=utf-8

# Optional: colorized log output for uvicorn
export UVICORN_COLOR=true

# 🧹 Clear terminal before start
clear

# Start FastAPI server with live reload
echo "=========================================="
echo "🚀 Starting FastAPI server (unbuffered logs)"
echo "=========================================="
uvicorn main:app --reload --host 127.0.0.1 --port 8000 --log-level debug
