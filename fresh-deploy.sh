#!/bin/bash

# Fresh Deployment Script for Digital Ocean
# This script backs up env vars, cleans everything, and does a fresh deployment

set -e

SERVER_USER="floral"
SERVER_IP="64.227.50.213"
PROJECT_PATH="/home/floral/floralgifts"
BACKUP_DIR="/home/floral/backup-$(date +%Y%m%d-%H%M%S)"

echo "🔄 Starting fresh deployment process..."
echo ""

# Step 1: Backup environment variables
echo "📦 Step 1: Backing up environment variables..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
BACKUP_DIR="/home/floral/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup .env files
if [ -f /home/floral/floralgifts/.env.local ]; then
    cp /home/floral/floralgifts/.env.local $BACKUP_DIR/.env.local
    echo "✅ Backed up .env.local"
fi

if [ -f /home/floral/floralgifts/.env ]; then
    cp /home/floral/floralgifts/.env $BACKUP_DIR/.env
    echo "✅ Backed up .env"
fi

# Backup ecosystem.config.js (has env vars)
if [ -f /home/floral/floralgifts/ecosystem.config.js ]; then
    cp /home/floral/floralgifts/ecosystem.config.js $BACKUP_DIR/ecosystem.config.js
    echo "✅ Backed up ecosystem.config.js"
fi

# List backup contents
echo ""
echo "📋 Backup contents:"
ls -la $BACKUP_DIR
echo ""
echo "💾 Backup location: $BACKUP_DIR"
ENDSSH

echo ""
read -p "✅ Backup complete. Continue with fresh deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Step 2: Stop PM2 and clean
echo ""
echo "🛑 Step 2: Stopping PM2 and cleaning..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/floral/floralgifts

# Stop PM2
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Kill all Node processes
pkill -9 node 2>/dev/null || true

# Wait
sleep 2

echo "✅ PM2 stopped and processes killed"
ENDSSH

# Step 3: Backup and remove old project
echo ""
echo "🗑️  Step 3: Removing old project files..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/floral

# Backup old project (just in case)
if [ -d floralgifts ]; then
    mv floralgifts floralgifts-old-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
    echo "✅ Old project backed up"
fi

# Remove any remaining files
rm -rf floralgifts 2>/dev/null || true

echo "✅ Old project removed"
ENDSSH

# Step 4: Fresh clone
echo ""
echo "📥 Step 4: Cloning fresh repository..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
echo "✅ Repository cloned"
ENDSSH

# Step 5: Restore environment variables
echo ""
echo "📋 Step 5: Restoring environment variables..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/floral/floralgifts

# Find the most recent backup
BACKUP_DIR=$(ls -td /home/floral/backup-* 2>/dev/null | head -1)

if [ -z "$BACKUP_DIR" ]; then
    echo "⚠️  No backup found. You'll need to set up .env.local manually"
else
    echo "📦 Restoring from: $BACKUP_DIR"
    
    if [ -f $BACKUP_DIR/.env.local ]; then
        cp $BACKUP_DIR/.env.local .env.local
        echo "✅ Restored .env.local"
    fi
    
    if [ -f $BACKUP_DIR/.env ]; then
        cp $BACKUP_DIR/.env .env
        echo "✅ Restored .env"
    fi
    
    if [ -f $BACKUP_DIR/ecosystem.config.js ]; then
        # Merge PORT setting if needed
        cp $BACKUP_DIR/ecosystem.config.js ecosystem.config.js.backup
        echo "✅ Backed up ecosystem.config.js"
    fi
fi
ENDSSH

# Step 6: Install dependencies
echo ""
echo "📦 Step 6: Installing dependencies..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm install --production"

# Step 7: Build
echo ""
echo "🔨 Step 7: Building application..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && NODE_OPTIONS='--max-old-space-size=4096' npm run build"

# Step 8: Update ecosystem.config.js for port 3001
echo ""
echo "⚙️  Step 8: Configuring PM2..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /home/floral/floralgifts

# Update ecosystem.config.js to use port 3001
cat > ecosystem.config.js << 'EOF'
// PM2 Ecosystem Configuration for Floral Whispers Gifts
module.exports = {
  apps: [
    {
      name: 'floralgifts',
      script: 'npm',
      args: 'start',
      cwd: '/home/floral/floralgifts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NODE_OPTIONS: '--max-old-space-size=2048',
      },
      error_file: '/home/floral/floralgifts/logs/pm2-error.log',
      out_file: '/home/floral/floralgifts/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1536M',
    },
  ],
};
EOF

echo "✅ ecosystem.config.js configured"
ENDSSH

# Step 9: Create logs directory
echo ""
echo "📁 Step 9: Creating logs directory..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${PROJECT_PATH}/logs"

# Step 10: Start PM2
echo ""
echo "🚀 Step 10: Starting PM2..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 start ecosystem.config.js"

# Step 11: Save PM2
echo ""
echo "💾 Step 11: Saving PM2 configuration..."
ssh ${SERVER_USER}@${SERVER_IP} "pm2 save"

# Step 12: Verify
echo ""
echo "✅ Step 12: Verifying deployment..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Port Check ==="
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

echo ""
echo "=== Test App ==="
curl -s http://localhost:3001 | head -5 || echo "App not responding yet"

echo ""
echo "=== Recent Logs ==="
pm2 logs floralgifts --lines 10 --nostream
ENDSSH

echo ""
echo "✅ Fresh deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify .env.local has all required variables"
echo "2. Test the site: https://floralwhispersgifts.co.ke"
echo "3. Check logs: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs floralgifts'"
