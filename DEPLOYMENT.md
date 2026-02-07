# Digital Ocean Deployment Commands

## Quick Update Commands

### Option 1: SSH and Run Commands Manually

```bash
# Connect to your server
ssh floral@157.245.34.218

# Navigate to project directory
cd /home/floral/floralgifts

# Pull latest changes from Git
git pull origin main

# Install/update dependencies
npm install --production

# Build the application (with increased memory limit)
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# OR use the npm script (already configured)
npm run build

# Restart PM2
pm2 restart floralgifts

# Check status
pm2 status

# View logs (if needed)
pm2 logs floralgifts --lines 50
```

---

### Option 2: One-Line Command (from your local machine)

```bash
ssh floral@157.245.34.218 "cd /home/floral/floralgifts && git pull origin main && npm install --production && NODE_OPTIONS='--max-old-space-size=4096' npm run build && pm2 restart floralgifts"
```

---

### Option 3: Using the Deploy Script

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment script
./deploy.sh 157.245.34.218 floral /home/floral/floralgifts
```

---

## Complete Deployment Workflow

### Step 1: Commit and Push Changes Locally

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Update: Mobile styling fixes and improvements"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Digital Ocean Server

```bash
# SSH into server
ssh floral@157.245.34.218

# Navigate to project
cd /home/floral/floralgifts

# Pull latest code
git pull origin main

# Install dependencies (production only)
npm install --production

# Build Next.js app (with increased memory)
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# Restart application with PM2
pm2 restart floralgifts

# Verify it's running
pm2 status

# Check logs for errors
pm2 logs floralgifts --lines 20
```

---

## Troubleshooting Commands

### If Build Fails (Memory Issues)

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --production

# Try building again with increased memory
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# If still failing, try low-memory build
npm run build:low-memory
```

### If PM2 App Won't Start

```bash
# Stop the app
pm2 stop floralgifts

# Delete from PM2
pm2 delete floralgifts

# Start fresh
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

### Check Application Status

```bash
# PM2 status
pm2 status

# PM2 logs (real-time)
pm2 logs floralgifts

# PM2 logs (last 100 lines)
pm2 logs floralgifts --lines 100

# Check if app is responding
curl http://localhost:3000

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart PM2 app
pm2 restart floralgifts

# Restart Nginx
sudo systemctl restart nginx

# Restart both
pm2 restart floralgifts && sudo systemctl restart nginx
```

---

## Environment Variables

If you need to update environment variables:

```bash
# Edit .env.local file
nano /home/floral/floralgifts/.env.local

# After editing, restart PM2
pm2 restart floralgifts
```

---

## Database Migrations

If you have database migrations to run:

```bash
# Run migrations (if you have a migration script)
npm run migrate

# Or manually via Supabase dashboard
# Go to: https://supabase.com/dashboard
```

---

## Quick Health Check

```bash
# Check if app is running
pm2 status

# Test local endpoint
curl http://localhost:3000

# Test public endpoint
curl https://floralwhispersgifts.co.ke

# Check disk space
df -h

# Check memory usage
free -h

# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## Rollback (if something goes wrong)

```bash
# Go to project directory
cd /home/floral/floralgifts

# Check git log
git log --oneline -10

# Rollback to previous commit
git reset --hard HEAD~1

# Or rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
npm run build
pm2 restart floralgifts
```

---

## Server Information

- **Server IP**: 157.245.34.218
- **Username**: floral
- **Project Path**: /home/floral/floralgifts
- **PM2 App Name**: floralgifts
- **Port**: 3000
- **Domain**: floralwhispersgifts.co.ke

---

## Notes

- Always test locally before deploying
- Check PM2 logs after deployment
- Monitor server resources (CPU, memory, disk)
- Keep backups of important data
- Use `--production` flag for npm install to avoid dev dependencies
