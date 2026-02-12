# Server Console Commands for Digital Ocean Droplet

## Quick Update Commands (Run on Server Console)

### Option 1: Update from Git and Restart (Recommended)

```bash
cd /home/floral/floralgifts
git pull origin main
npm install --production
rm -rf .next
npm run build
pm2 restart floralgifts
pm2 save
pm2 status floralgifts
```

### Option 2: Using the Update Script

1. Copy the script to your server:
```bash
# On your local machine, copy the script:
scp server-update.sh floral@157.245.34.218:/home/floral/
```

2. On the server console, run:
```bash
chmod +x /home/floral/server-update.sh
/home/floral/server-update.sh
```

### Option 3: Manual Step-by-Step Commands

```bash
# Navigate to app directory
cd /home/floral/floralgifts

# Pull latest code
git pull origin main

# Update dependencies (if package.json changed)
npm install --production

# Rebuild application
rm -rf .next
npm run build

# Restart application
pm2 restart floralgifts
pm2 save

# Check status
pm2 status floralgifts

# View logs (optional)
pm2 logs floralgifts --lines 20
```

---

## Useful PM2 Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs floralgifts

# View last 50 lines of logs
pm2 logs floralgifts --lines 50

# Restart application
pm2 restart floralgifts

# Stop application
pm2 stop floralgifts

# Start application
pm2 start floralgifts

# Reload application (zero-downtime restart)
pm2 reload floralgifts

# Delete application from PM2
pm2 delete floralgifts

# Save PM2 configuration
pm2 save

# View PM2 monitoring
pm2 monit
```

---

## Environment Variables

Check/update environment variables:
```bash
cd /home/floral/floralgifts
cat .env.local

# Edit if needed
nano .env.local

# After editing, restart application
pm2 restart floralgifts
```

---

## Check Application Health

```bash
# Check if application is running
curl http://localhost:3000

# Check PM2 status
pm2 status

# Check system resources
htop
# or
top

# Check disk space
df -h

# Check application logs for errors
pm2 logs floralgifts --err --lines 50
```

---

## Troubleshooting

### Application won't start:
```bash
# Check logs
pm2 logs floralgifts --err

# Check if port 3000 is in use
lsof -i :3000

# Kill process on port 3000 if needed
lsof -ti:3000 | xargs kill -9

# Restart application
pm2 restart floralgifts
```

### Build fails:
```bash
# Clear cache and rebuild
cd /home/floral/floralgifts
rm -rf .next node_modules
npm install
npm run build
pm2 restart floralgifts
```

### Git pull fails:
```bash
# Check git status
cd /home/floral/floralgifts
git status

# If there are local changes, stash them
git stash

# Then pull again
git pull origin main
```

---

## Quick Update Script (Copy-Paste Ready)

```bash
#!/bin/bash
cd /home/floral/floralgifts && \
git pull origin main && \
npm install --production && \
rm -rf .next && \
npm run build && \
pm2 restart floralgifts && \
pm2 save && \
pm2 status floralgifts
```

Copy and paste this entire block into your server console.
