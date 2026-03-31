#!/bin/bash

# Quick Fix for Git Merge Conflicts
# Use this script to resolve package.json conflicts during deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Fixing Git Merge Conflicts...${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Option 1: Stash local changes (recommended)
echo -e "${YELLOW}📦 Option 1: Stashing local changes...${NC}"
git stash push -m "Deployment stash - package files" -- package.json package-lock.json 2>/dev/null || echo -e "${YELLOW}No changes to stash${NC}"

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Option 2: Force update package files (alternative approach)
echo -e "${YELLOW}📦 Option 2: Force updating package files...${NC}"
git checkout origin/main -- package.json package-lock.json

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

# Build
echo -e "${YELLOW}🔨 Building application...${NC}"
rm -rf .next
npm run build

# Restart PM2
echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
pm2 restart floralgifts || pm2 start npm --name floralgifts -- start

pm2 save
pm2 status floralgifts

echo -e "${GREEN}✅ Git conflicts resolved and deployment completed!${NC}"
