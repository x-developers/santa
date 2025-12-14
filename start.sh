#!/bin/bash
set -e

# Get port from Railway or default to 8080
PORT=${PORT:-8080}

echo "Configuring nginx for port $PORT..."
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf

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
echo "Starting nginx on port $PORT..."
nginx -g "daemon off;"
