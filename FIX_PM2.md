# Fix PM2 Permission Errors

## Problem
PM2 can't create directories in `/home/floral/.pm2` due to permission issues.

## Solution - Run These Commands

```bash
# 1. Fix floral user home directory
userdel -r floral 2>/dev/null || true
rm -rf /home/floral 2>/dev/null || true
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# 2. Set proper permissions
chown -R floral:floral /home/floral
chmod 755 /home/floral

# 3. Create PM2 directories manually
mkdir -p /home/floral/.pm2/logs
mkdir -p /home/floral/.pm2/pids
mkdir -p /home/floral/.pm2/modules
touch /home/floral/.pm2/module_conf.json
touch /home/floral/.pm2/pm2.log

# 4. Set ownership
chown -R floral:floral /home/floral/.pm2
chmod -R 755 /home/floral/.pm2

# 5. Verify
ls -la /home/floral
ls -la /home/floral/.pm2

# 6. Now try PM2 as floral user
su - floral -c "pm2 --version"
```

---

## Complete Setup After Fixing Permissions

```bash
# After fixing permissions above, continue with:

# Clone repository
su - floral -c "cd /home/floral && git clone https://github.com/NelsonFranklinWere/floralgifts.git"

# Create .env.local
cat > /home/floral/floralgifts/.env.local << 'ENVEOF'
# (Supabase removed — app now uses PostgreSQL)
# (Supabase removed — app now uses PostgreSQL)
# (Supabase removed — app now uses PostgreSQL)
NEXT_PUBLIC_BASE_URL=https://floralwhispersgifts.co.ke
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=<your-mpesa-consumer-key>
MPESA_CONSUMER_SECRET=<your-mpesa-consumer-secret>
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_from_safaricom_portal
MPESA_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/mpesa/callback
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string
ADMIN_EMAIL=whispersfloral@gmail.com
ADMIN_PASSWORD=Admin@2025
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=FloralWebsite@resend.dev
GOOGLE_VERIFICATION=
COOP_BANK_CONSUMER_KEY=<your-coopbank-consumer-key>
COOP_BANK_CONSUMER_SECRET=YOUR_ACTUAL_SECRET_HERE
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
PESAPAL_CONSUMER_KEY=<your-pesapal-consumer-key>
PESAPAL_CONSUMER_SECRET=<your-pesapal-consumer-secret>
PESAPAL_ENV=production
PESAPAL_IPN_ID=a6b958a3-a851-4521-b148-dadbd540ea64
PESAPAL_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/pesapal/callback
ENVEOF
chown floral:floral /home/floral/floralgifts/.env.local && chmod 600 /home/floral/floralgifts/.env.local

# Install and build
su - floral -c "cd /home/floral/floralgifts && npm install --production && NODE_OPTIONS='--max-old-space-size=4096' npm run build"

# Create PM2 config
cat > /home/floral/floralgifts/ecosystem.config.js << 'EOF'
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
chown floral:floral /home/floral/floralgifts/ecosystem.config.js
mkdir -p /home/floral/floralgifts/logs && chown -R floral:floral /home/floral/floralgifts/logs

# Start PM2 (should work now)
su - floral -c "cd /home/floral/floralgifts && pm2 start ecosystem.config.js && pm2 save"

# Verify
su - floral -c "pm2 status"
curl http://localhost:3001 | head -10
```
