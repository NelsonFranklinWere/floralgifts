# Manual Fresh Deployment Guide

## Step-by-Step Commands to Run on Server

### Step 1: Backup Environment Variables

```bash
# Create backup directory
BACKUP_DIR="/home/floral/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup .env files
cd /home/floral/floralgifts
if [ -f .env.local ]; then
    cp .env.local $BACKUP_DIR/.env.local
    echo "✅ Backed up .env.local"
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

# Show backup location
echo "Backup location: $BACKUP_DIR"
ls -la $BACKUP_DIR
```

---

### Step 2: Stop PM2 and Kill Processes

```bash
# Stop PM2
pm2 stop all
pm2 delete all
pm2 kill

# Kill all Node processes
pkill -9 node

# Wait
sleep 3
```

---

### Step 3: Backup and Remove Old Project

```bash
cd /home/floral

# Backup old project
if [ -d floralgifts ]; then
    mv floralgifts floralgifts-old-$(date +%Y%m%d-%H%M%S)
    echo "✅ Old project backed up"
fi

# Remove any remaining files
rm -rf floralgifts
```

---

### Step 4: Fresh Clone

```bash
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
```

---

### Step 5: Restore Environment Variables

```bash
# Find backup directory (use the one from Step 1)
BACKUP_DIR="/home/floral/backup-YYYYMMDD-HHMMSS"  # Replace with actual backup dir

# Restore .env files
if [ -f $BACKUP_DIR/.env.local ]; then
    cp $BACKUP_DIR/.env.local .env.local
    echo "✅ Restored .env.local"
fi

if [ -f $BACKUP_DIR/.env ]; then
    cp $BACKUP_DIR/.env .env
    echo "✅ Restored .env"
fi
```

---

### Step 6: Install Dependencies

```bash
cd /home/floral/floralgifts
npm install --production
```

---

### Step 7: Build Application

```bash
cd /home/floral/floralgifts
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

---

### Step 8: Configure PM2

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
```

---

### Step 9: Create Logs Directory

```bash
mkdir -p /home/floral/floralgifts/logs
```

---

### Step 10: Start PM2

```bash
cd /home/floral/floralgifts
pm2 start ecosystem.config.js
pm2 save
```

---

### Step 11: Verify

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs floralgifts --lines 20

# Test app
curl http://localhost:3001

# Check port
netstat -tlnp | grep 3001
```

---

### Step 12: Verify Nginx Configuration

```bash
# Check Nginx is pointing to port 3001
sudo grep proxy_pass /etc/nginx/sites-available/floralwhispersgifts.co.ke

# Should show: proxy_pass http://localhost:3001;

# If not, update it:
sudo nano /etc/nginx/sites-available/floralwhispersgifts.co.ke
# Change proxy_pass to http://localhost:3001;

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## Environment Variables Checklist

After restoring, verify these are set in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PESAPAL_CONSUMER_KEY`
- `PESAPAL_CONSUMER_SECRET`
- `PESAPAL_IPN_ID`
- `RESEND_API_KEY`
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- Any other API keys or secrets

---

## Troubleshooting

If something goes wrong:

1. **Check backup location**: `ls -la /home/floral/backup-*`
2. **Restore from backup**: Copy files from backup directory
3. **Check logs**: `pm2 logs floralgifts`
4. **Verify env vars**: `cat .env.local` (don't share publicly!)
