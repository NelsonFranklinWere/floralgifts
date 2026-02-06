#!/bin/bash

# Floral Whispers Gifts - Server Initial Setup Script
# Run this script ON THE SERVER to set up Node.js, PM2, Nginx, and SSL

set -e

echo "🔧 Starting server setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for Node 18)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw status

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Clone your repository"
echo "   2. Install dependencies: npm install"
echo "   3. Setup PM2: pm2 start ecosystem.config.js"
echo "   4. Setup PM2 startup: pm2 startup ubuntu"
echo "   5. Configure Nginx (see nginx-config.conf)"
echo "   6. Setup SSL: sudo certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke"

