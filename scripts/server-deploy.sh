#!/bin/bash
# Run this script ON THE SERVER (e.g. after ssh) to deploy from Git.
# Usage: cd /home/floral/floralgifts && bash scripts/server-deploy.sh

set -e

APP_DIR="${1:-$(pwd)}"
cd "$APP_DIR"

echo "=========================================="
echo "Deploying floralgifts from Git"
echo "=========================================="
echo "App dir: $APP_DIR"
echo ""

# Allow pull to succeed: discard local changes to lockfiles so merge never aborts
echo "Resetting package.json and package-lock.json so git pull can run..."
git checkout -- package.json package-lock.json 2>/dev/null || true

echo "Pulling latest from origin main..."
git pull origin main

echo "Installing dependencies..."
npm install --omit=dev

echo "Rebuilding Next.js..."
rm -rf .next
npm run build

echo "Restarting app with PM2..."
pm2 restart floralgifts 2>/dev/null || pm2 start npm --name floralgifts -- start

pm2 save
pm2 status floralgifts

echo ""
echo "Deploy finished."
