#!/bin/bash

# Replace port in nginx config
sed -i "s/listen 8080/listen ${PORT:-8080}/g" /etc/nginx/conf.d/default.conf

# Start backend in background
uvicorn app.main:app --host 127.0.0.1 --port 8000 &

# Start nginx in foreground
nginx -g "daemon off;"
