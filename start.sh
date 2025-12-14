#!/bin/bash
set -e

# Get port from Railway or default to 8080
echo "PORT env variable: $PORT"
PORT=${PORT:-8080}
echo "Using port: $PORT"

echo "Configuring nginx for port $PORT..."
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf

echo "Starting backend..."
cd /app
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    echo "Attempt $i: Backend not ready yet..."
    sleep 1
done

# Final check
if ! curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "Backend failed to start!"
    exit 1
fi

echo "Backend started on port 8000"
echo "Starting nginx on port $PORT..."
nginx -g "daemon off;"
