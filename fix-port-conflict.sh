#!/bin/bash

# Fix Port 3000 Conflict on Server
# This script finds and kills processes using port 3000, then restarts PM2

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
PROJECT_PATH="/home/floral/floralgifts"

echo "🔍 Finding processes using port 3000..."

# Find process using port 3000
ssh ${SERVER_USER}@${SERVER_IP} "lsof -ti:3000 || echo 'No process found on port 3000'"

echo ""
echo "🛑 Stopping PM2 processes..."
ssh ${SERVER_USER}@${SERVER_IP} "pm2 stop all || true"
ssh ${SERVER_USER}@${SERVER_IP} "pm2 delete all || true"

echo ""
echo "🔪 Killing any processes on port 3000..."
ssh ${SERVER_USER}@${SERVER_IP} "lsof -ti:3000 | xargs kill -9 || echo 'No processes to kill'"

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2

echo ""
echo "🔄 Starting PM2 application..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 start ecosystem.config.js"

echo ""
echo "📊 Checking PM2 status..."
ssh ${SERVER_USER}@${SERVER_IP} "pm2 status"

echo ""
echo "✅ Done! Check logs with: pm2 logs floralgifts"
