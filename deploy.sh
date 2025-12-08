#!/bin/bash

# Digital Ocean Deployment Script
# Usage: ./deploy.sh [server_ip] [username] [project_path]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration (update these with your server details)
SERVER_IP="${1:-your_server_ip}"
SERVER_USER="${2:-root}"
PROJECT_PATH="${3:-/var/www/floralgifts}"

echo -e "${GREEN}🚀 Starting deployment to Digital Ocean...${NC}"

# Step 1: Pull latest changes from GitHub
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git pull origin main"

# Step 2: Install/update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm install"

# Step 3: Build the application
echo -e "${YELLOW}🔨 Building the application...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm run build"

# Step 4: Restart the application (adjust based on your setup)
echo -e "${YELLOW}🔄 Restarting the application...${NC}"

# If using PM2
if ssh ${SERVER_USER}@${SERVER_IP} "command -v pm2 &> /dev/null"; then
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 restart floralgifts || pm2 start npm --name floralgifts -- start"
# If using systemd
elif ssh ${SERVER_USER}@${SERVER_IP} "systemctl is-active --quiet floralgifts"; then
    ssh ${SERVER_USER}@${SERVER_IP} "sudo systemctl restart floralgifts"
# If using Docker
elif ssh ${SERVER_USER}@${SERVER_IP} "command -v docker &> /dev/null"; then
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && docker-compose restart || docker-compose up -d"
# Otherwise, just kill and restart
else
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pkill -f 'next start' || true"
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && nohup npm start > /tmp/floralgifts.log 2>&1 &"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your site should be live at: https://floralwhispersgifts.co.ke${NC}"


