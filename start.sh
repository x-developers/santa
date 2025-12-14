#!/bin/bash
set -e

echo "Starting backend..."
cd /app
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend failed to start!"
    exit 1
fi

echo "Backend started on port 8000"

echo "Starting nginx..."
nginx -g "daemon off;"
