# Server Build Fix - Module Resolution Error

## Problem
Build failing with:
```
Module not found: Can't resolve '@/lib/utils'
Module not found: Can't resolve '@/lib/subcategories'
```

## Root Cause
When using `--webpack` flag in Next.js 16, webpack doesn't automatically read TypeScript path aliases from `tsconfig.json`. We need explicit webpack alias configuration.

## Solution Applied
Added webpack alias configuration to `next.config.js`:

```javascript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname),
  };
  return config;
},
```

---

## Server Deployment Steps

### 1. Pull Latest Code (with fix)
```bash
cd /home/floral/floralgifts

# Stash any local changes
git stash

# Pull latest code
git pull origin main
```

### 2. Clear Build Cache
```bash
# Remove old build cache
rm -rf .next

# Clear npm cache (optional but recommended)
npm cache clean --force
```

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Build with Increased Memory
```bash
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

### 5. Restart PM2
```bash
pm2 restart floralgifts
```

### 6. Verify
```bash
pm2 status
pm2 logs floralgifts --lines 20
```

---

## One-Line Command

```bash
cd /home/floral/floralgifts && git stash && git pull origin main && rm -rf .next && npm install --production && NODE_OPTIONS='--max-old-space-size=4096' npm run build && pm2 restart floralgifts
```

---

## Verification

After deployment, check:
1. ✅ Build completes without module errors
2. ✅ Admin pages load correctly (`/admin`, `/admin/orders`, `/admin/products`)
3. ✅ No errors in PM2 logs
4. ✅ Site is accessible at https://floralwhispersgifts.co.ke

---

## Notes

- The middleware deprecation warning is harmless - it's just informing about Next.js 16 changes
- The `--localstorage-file` warnings are also harmless Node.js warnings
- All admin pages should now compile correctly with the webpack alias fix
