# Server Port Fix Commands
# Run these commands directly on your server (SSH into: floral@64.227.50.213)

## Complete Fix - Copy and paste these commands:

```bash
# 1. Stop PM2 completely (breaks restart loop)
pm2 stop all
pm2 kill

# 2. Wait a moment
sleep 2

# 3. Kill all Node processes
pkill -9 node

# 4. Kill anything on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 5. Wait again
sleep 2

# 6. Verify port 3000 is free
lsof -ti:3000
# Should return nothing

# 7. Navigate to project
cd /home/floral/floralgifts

# 8. Start PM2 fresh
pm2 start ecosystem.config.js

# 9. Check status
pm2 status

# 10. Check logs
pm2 logs floralgifts --lines 20
```

---

## One-Liner (copy entire line):

```bash
pm2 stop all && pm2 kill && sleep 2 && pkill -9 node && sleep 2 && lsof -ti:3000 | xargs kill -9 2>/dev/null; sleep 2 && cd /home/floral/floralgifts && pm2 start ecosystem.config.js && sleep 3 && pm2 status && pm2 logs floralgifts --lines 10 --nostream
```

---

## If SSH Key Issues:

If you can't SSH with keys, use password authentication:

```bash
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no floral@64.227.50.213
```

Or use the Digital Ocean console/web terminal to run the commands directly.
