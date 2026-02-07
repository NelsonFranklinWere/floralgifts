# Fixing "JavaScript heap out of memory" Error

## Problem
The Next.js build process is running out of memory during compilation.

## Solutions Applied

### 1. Increased Node.js Memory Limit
- Updated `package.json` build script to use `--max-old-space-size=4096` (4GB)
- Added `build:low-memory` script for servers with less RAM (2GB)

### 2. Optimized Next.js Configuration
- Enabled `swcMinify` for faster, more memory-efficient minification
- Added `output: 'standalone'` for optimized builds
- Disabled CSS optimization during build to save memory
- Added webpack optimizations

### 3. Updated Deployment Scripts
- `quick-deploy.sh` now uses increased memory during build
- PM2 config updated with memory limits

---

## Deployment Commands

### Standard Build (4GB memory)
```bash
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

### Low Memory Build (2GB memory) - for smaller servers
```bash
npm run build:low-memory
```

### Or use the updated quick-deploy script
```bash
./quick-deploy.sh
```

---

## Server Memory Requirements

### Minimum Requirements:
- **Build**: 4GB RAM recommended (2GB minimum)
- **Runtime**: 1-2GB RAM

### If Your Server Has Less Than 4GB RAM:

1. **Option 1: Use Low Memory Build**
   ```bash
   npm run build:low-memory
   ```

2. **Option 2: Increase Swap Space** (temporary solution)
   ```bash
   # Check current swap
   free -h
   
   # Create 2GB swap file
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   
   # Make permanent
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

3. **Option 3: Build Locally and Deploy**
   ```bash
   # Build on your local machine (with more RAM)
   npm run build
   
   # Upload .next folder to server
   scp -r .next floral@157.245.34.218:/home/floral/floralgifts/
   
   # On server, just restart PM2
   ssh floral@157.245.34.218 "cd /home/floral/floralgifts && pm2 restart floralgifts"
   ```

---

## Troubleshooting

### Check Server Memory
```bash
# Check available memory
free -h

# Check Node.js memory limit
node -e "console.log(require('v8').getHeapStatistics())"
```

### Clear Build Cache
```bash
# Remove .next folder
rm -rf .next

# Clear npm cache
npm cache clean --force

# Rebuild
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

### Monitor Build Process
```bash
# Watch memory usage during build
watch -n 1 free -h

# In another terminal, run build
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

---

## Alternative: Build in Stages

If memory is still an issue, you can build specific pages:

```bash
# Build only specific routes (not recommended for production)
NODE_OPTIONS='--max-old-space-size=4096' next build --no-lint
```

---

## Digital Ocean Droplet Recommendations

### For Smooth Builds:
- **Minimum**: 2GB RAM droplet ($12/month)
- **Recommended**: 4GB RAM droplet ($24/month)
- **Optimal**: 8GB RAM droplet ($48/month)

### Current Setup Check:
```bash
# SSH into server
ssh floral@157.245.34.218

# Check RAM
free -h

# Check swap
swapon --show
```

---

## Quick Fix Commands

```bash
# 1. SSH to server
ssh floral@157.245.34.218

# 2. Navigate to project
cd /home/floral/floralgifts

# 3. Pull latest code
git pull origin main

# 4. Clear old build
rm -rf .next

# 5. Install dependencies
npm install --production

# 6. Build with increased memory
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# 7. Restart PM2
pm2 restart floralgifts

# 8. Check status
pm2 status
pm2 logs floralgifts --lines 20
```
