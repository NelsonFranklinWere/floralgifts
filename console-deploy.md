# Console-Based Fresh Deployment Guide
# Run these commands in Digital Ocean Web Console

## Step 1: Backup Environment Variables

```bash
# Create backup directory
BACKUP_DIR="/home/floral/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Navigate to project
cd /home/floral/floralgifts

# Backup .env files
if [ -f .env.local ]; then
    cp .env.local $BACKUP_DIR/.env.local
    echo "✅ Backed up .env.local"
    cat .env.local > $BACKUP_DIR/env-local-backup.txt
fi

if [ -f .env ]; then
    cp .env $BACKUP_DIR/.env
    echo "✅ Backed up .env"
fi

# Backup ecosystem.config.js
if [ -f ecosystem.config.js ]; then
    cp ecosystem.config.js $BACKUP_DIR/ecosystem.config.js
    echo "✅ Backed up ecosystem.config.js"
fi

# Show backup location and contents
echo "📦 Backup location: $BACKUP_DIR"
ls -la $BACKUP_DIR

# Display .env.local contents (for manual copy if needed)
echo ""
echo "📋 .env.local contents (copy this!):"
cat .env.local 2>/dev/null || echo "No .env.local found"
```

---

## Step 2: Stop PM2 and Clean Processes

```bash
# Stop PM2
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Kill all Node processes
pkill -9 node 2>/dev/null || true

# Kill anything on port 3000 or 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait
sleep 3

echo "✅ Processes stopped"
```

---

## Step 3: Backup and Remove Old Project

```bash
cd /home/floral

# Backup old project
if [ -d floralgifts ]; then
    OLD_BACKUP="floralgifts-old-$(date +%Y%m%d-%H%M%S)"
    mv floralgifts $OLD_BACKUP
    echo "✅ Old project backed up to: $OLD_BACKUP"
fi

# Remove any remaining files
rm -rf floralgifts 2>/dev/null || true

echo "✅ Old project removed"
```

---

## Step 4: Fresh Clone from GitHub

```bash
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts

echo "✅ Repository cloned"
```

---

## Step 5: Restore Environment Variables

```bash
cd /home/floral/floralgifts

# Find the most recent backup
BACKUP_DIR=$(ls -td /home/floral/backup-* 2>/dev/null | head -1)

if [ -z "$BACKUP_DIR" ]; then
    echo "⚠️  No backup found. You'll need to create .env.local manually"
    echo ""
    echo "Create .env.local file:"
    echo "nano .env.local"
    echo ""
    echo "Then paste your environment variables"
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
fi

# Verify .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    echo "First few lines (verify it's correct):"
    head -5 .env.local
else
    echo "⚠️  WARNING: .env.local not found! Create it now:"
    echo "nano .env.local"
fi
```

---

## Step 6: Install Dependencies

```bash
cd /home/floral/floralgifts
npm install --production

echo "✅ Dependencies installed"
```

---

## Step 7: Build Application

```bash
cd /home/floral/floralgifts

# Clear any old build
rm -rf .next

# Build with increased memory
NODE_OPTIONS='--max-old-space-size=4096' npm run build

echo "✅ Build complete"
```

---

## Step 8: Configure PM2

```bash
cd /home/floral/floralgifts

# Create ecosystem.config.js
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

echo "✅ ecosystem.config.js created"
cat ecosystem.config.js
```

---

## Step 9: Create Logs Directory

```bash
mkdir -p /home/floral/floralgifts/logs
echo "✅ Logs directory created"
```

---

## Step 10: Start PM2

```bash
cd /home/floral/floralgifts
pm2 start ecosystem.config.js
pm2 save

echo "✅ PM2 started"
pm2 status
```

---

## Step 11: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs floralgifts --lines 20 --nostream

# Test app locally
curl http://localhost:3001 | head -20

# Check port
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

echo ""
echo "✅ Verification complete"
```

---

## Step 12: Verify Nginx Configuration

```bash
# Check Nginx config
sudo grep proxy_pass /etc/nginx/sites-available/floralwhispersgifts.co.ke

# Should show: proxy_pass http://localhost:3001;

# If it shows port 3000, update it:
sudo nano /etc/nginx/sites-available/floralwhispersgifts.co.ke
# Change: proxy_pass http://localhost:3000;
# To:     proxy_pass http://localhost:3001;

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## Fix SSH Access (Optional)

If you want to fix SSH access later:

```bash
# Check SSH service
sudo systemctl status ssh
sudo systemctl status sshd

# Restart SSH
sudo systemctl restart ssh
sudo systemctl restart sshd

# Check firewall
sudo ufw status
sudo ufw allow ssh
sudo ufw allow 22

# Check SSH config
sudo nano /etc/ssh/sshd_config
# Make sure: PermitRootLogin yes (or no, depending on your setup)
# Make sure: PasswordAuthentication yes (if using password)

# Restart SSH after config changes
sudo systemctl restart sshd
```

---

## Environment Variables Template

If you need to recreate `.env.local`, here's what you need:

```bash
nano /home/floral/floralgifts/.env.local
```

Required variables (get from your backup or local file):
- `NEXT_PUBLIC_SUPABASE_URL=`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
- `SUPABASE_SERVICE_ROLE_KEY=`
- `PESAPAL_CONSUMER_KEY=`
- `PESAPAL_CONSUMER_SECRET=`
- `PESAPAL_IPN_ID=`
- `RESEND_API_KEY=`
- `JWT_SECRET=`
- `NEXT_PUBLIC_BASE_URL=https://floralwhispersgifts.co.ke`
- Any other API keys

---

## Quick Copy-Paste All Steps

```bash
# Run all steps at once (copy entire block)
BACKUP_DIR="/home/floral/backup-$(date +%Y%m%d-%H%M%S)" && \
mkdir -p $BACKUP_DIR && \
cd /home/floral/floralgifts && \
cp .env.local $BACKUP_DIR/ 2>/dev/null && \
cp ecosystem.config.js $BACKUP_DIR/ 2>/dev/null && \
pm2 kill && pkill -9 node && sleep 2 && \
cd /home/floral && \
mv floralgifts floralgifts-old-$(date +%Y%m%d-%H%M%S) 2>/dev/null && \
git clone https://github.com/NelsonFranklinWere/floralgifts.git && \
cd floralgifts && \
cp $BACKUP_DIR/.env.local .env.local 2>/dev/null && \
npm install --production && \
NODE_OPTIONS='--max-old-space-size=4096' npm run build && \
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'floralgifts',
    script: 'npm',
    args: 'start',
    cwd: '/home/floral/floralgifts',
    env: { NODE_ENV: 'production', PORT: 3001, NODE_OPTIONS: '--max-old-space-size=2048' },
    error_file: '/home/floral/floralgifts/logs/pm2-error.log',
    out_file: '/home/floral/floralgifts/logs/pm2-out.log',
    autorestart: true,
    max_memory_restart: '1536M',
  }],
};
EOF
mkdir -p logs && \
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 status
```
