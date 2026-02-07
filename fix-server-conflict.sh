#!/bin/bash

# Fix Git Conflict on Server
# This script handles local changes that conflict with git pull

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
PROJECT_PATH="/home/floral/floralgifts"

echo "🔧 Fixing git conflict on server..."

# Option 1: Stash changes and pull
echo "📦 Stashing local changes..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git stash"

# Pull latest changes
echo "📥 Pulling latest changes..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git pull origin main"

# Check if stash has important changes
echo "🔍 Checking stashed changes..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git stash list"

echo ""
echo "✅ Conflict resolved!"
echo ""
echo "If you need to see what was stashed:"
echo "  ssh ${SERVER_USER}@${SERVER_IP} 'cd ${PROJECT_PATH} && git stash show -p'"
echo ""
echo "To apply stashed changes later:"
echo "  ssh ${SERVER_USER}@${SERVER_IP} 'cd ${PROJECT_PATH} && git stash pop'"
echo ""
echo "To discard stashed changes:"
echo "  ssh ${SERVER_USER}@${SERVER_IP} 'cd ${PROJECT_PATH} && git stash drop'"
