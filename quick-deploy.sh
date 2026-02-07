#!/bin/bash

# Quick Deployment Script for Digital Ocean
# Usage: ./quick-deploy.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Server details
SERVER_USER="floral"
SERVER_IP="157.245.34.218"
PROJECT_PATH="/home/floral/floralgifts"

echo -e "${GREEN}🚀 Deploying to Digital Ocean...${NC}"
echo ""

# Step 1: Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git pull origin main"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm install --production"

# Step 3: Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm run build"

# Step 4: Restart PM2
echo -e "${YELLOW}🔄 Restarting application...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 restart floralgifts"

# Step 5: Check status
echo -e "${YELLOW}📊 Checking status...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "pm2 status floralgifts"

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}🌐 Site: https://floralwhispersgifts.co.ke${NC}"
