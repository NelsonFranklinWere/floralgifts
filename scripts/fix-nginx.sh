#!/bin/bash
# Fix Nginx configuration and start the service
# Run this on the server

set -e

echo "🔧 Fixing Nginx configuration for floralwhispersgifts.co.ke..."

# Create the correct Nginx configuration
sudo tee /etc/nginx/sites-available/floralwhispersgifts > /dev/null << 'EOFCONF'
# HTTP Configuration for Floral Whispers Gifts
server {
    listen 80;
    listen [::]:80;
    server_name floralwhispersgifts.co.ke www.floralwhispersgifts.co.ke 157.245.34.218;

    # Increase body size limit for file uploads
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Static files from Next.js
    location /_next/static {
        alias /home/floral/floralgifts/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public files (images, etc.)
    location /images {
        alias /home/floral/floralgifts/public/images;
        expires 30d;
        add_header Cache-Control "public";
    }

    # All other requests to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOFCONF

# Create symlink
echo "📋 Creating symlink..."
sudo ln -sf /etc/nginx/sites-available/floralwhispersgifts /etc/nginx/sites-enabled/floralwhispersgifts

# Remove old incorrect config
echo "🧹 Removing old configuration..."
sudo rm -f /etc/nginx/sites-enabled/floralgifts

# Test configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Start Nginx
echo "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
echo ""
echo "📊 Nginx status:"
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "✅ Nginx fixed and started!"
echo "🌐 Test: http://floralwhispersgifts.co.ke"

