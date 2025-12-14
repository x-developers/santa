FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend code
COPY backend/app ./app

# Frontend build
COPY --from=frontend-builder /frontend/dist /var/www/html

# Nginx config
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create data directory
RUN mkdir -p /app/data

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV PORT=8080

EXPOSE $PORT

CMD ["/start.sh"]
