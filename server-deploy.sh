#!/bin/bash

# Floral Gifts Server Deployment Script
# This script handles safe deployment on the server with proper git conflict resolution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌸 Starting Floral Gifts Server Deployment...${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Backup current package files (in case we need to restore)
echo -e "${YELLOW}💾 Backing up current package files...${NC}"
cp package.json package.json.backup 2>/dev/null || true
cp package-lock.json package-lock.json.backup 2>/dev/null || true

# Stash local changes to package files
echo -e "${YELLOW}📦 Stashing local package changes...${NC}"
git stash push -m "Deployment stash - package files" -- package.json package-lock.json 2>/dev/null || true

# Get latest code from GitHub
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed. Restoring backup and exiting...${NC}"
    cp package.json.backup package.json 2>/dev/null || true
    cp package-lock.json.backup package-lock.json 2>/dev/null || true
    exit 1
fi

# Install/update dependencies (safe to run every deploy)
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

# Check if npm install was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ NPM install failed. Exiting...${NC}"
    exit 1
fi

# Rebuild the Next.js app
echo -e "${YELLOW}🔨 Rebuilding Next.js app...${NC}"
rm -rf .next
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Restoring backup and exiting...${NC}"
    cp package.json.backup package.json 2>/dev/null || true
    cp package-lock.json.backup package-lock.json 2>/dev/null || true
    exit 1
fi

# Restart the app with PM2
echo -e "${YELLOW}🔄 Restarting application with PM2...${NC}"
pm2 restart floralgifts || pm2 start npm --name floralgifts -- start

# Save PM2 process list and check status
echo -e "${YELLOW}💾 Saving PM2 process list...${NC}"
pm2 save

echo -e "${BLUE}📊 Checking PM2 status...${NC}"
pm2 status floralgifts

# Clean up backup files
echo -e "${YELLOW}🧹 Cleaning up backup files...${NC}"
rm -f package.json.backup package-lock.json.backup

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app should now be running with the latest changes.${NC}"

# Show final status
echo -e "${BLUE}📋 Final deployment summary:${NC}"
echo -e "${BLUE}   • Git: Updated to latest main branch${NC}"
echo -e "${BLUE}   • Dependencies: Installed/Updated${NC}"
echo -e "${BLUE}   • Build: Next.js app rebuilt${NC}"
echo -e "${BLUE}   • PM2: Application restarted${NC}"
echo -e "${BLUE}   • Status: Ready to serve traffic${NC}"
