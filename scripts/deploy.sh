#!/bin/bash
# Deploy script for floralgifts (run on server)
# Use full install so TypeScript and devDependencies are available for build.

set -e
cd /home/floral/floralgifts

echo "→ Pulling latest code..."
git pull origin main

echo "→ Installing dependencies (including dev, required for build)..."
npm install

echo "→ Building Next.js app..."
rm -rf .next
npm run build

echo "→ Restarting app..."
pm2 restart floralgifts || pm2 start npm --name floralgifts -- start

pm2 save
pm2 status floralgifts
echo "Done."
