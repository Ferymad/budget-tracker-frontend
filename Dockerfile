# Multi-stage build for React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Create start script for dynamic PORT
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'export PORT=${PORT:-8080}' >> /start.sh && \
    echo 'envsubst "\$PORT" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Create Nginx config template for Railway dynamic PORT
RUN echo 'server {' > /etc/nginx/conf.d/default.conf.template && \
    echo '    listen $PORT;' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    ' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    # SPA routing - serve index.html for all routes' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf.template && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf.template && \
    echo '    }' >> /etc/nginx/conf.d/default.conf.template && \
    echo '}' >> /etc/nginx/conf.d/default.conf.template

# Railway will provide PORT environment variable dynamically
CMD ["/start.sh"]