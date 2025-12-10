#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Run this script ON THE SERVER after Nginx is configured

set -e

DOMAIN="floralwhispersgifts.co.ke"
WWW_DOMAIN="www.floralwhispersgifts.co.ke"

echo "🔒 Setting up SSL certificate for $DOMAIN and $WWW_DOMAIN..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot is not installed. Installing..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Obtain SSL certificate
echo "📜 Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email admin@floralwhispersgifts.co.ke

# Test certificate renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

# Setup auto-renewal (usually already configured by certbot)
echo "✅ SSL certificate setup completed!"
echo ""
echo "📋 Certificate will auto-renew. Test renewal with: sudo certbot renew --dry-run"

