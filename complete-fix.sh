#!/bin/bash

# Complete Fix - Run as root in Digital Ocean Console

# 1. Fix PM2 corrupted config
rm -rf /home/floral/.pm2 2>/dev/null || true

# 2. Fix floral user
userdel -r floral 2>/dev/null || true
rm -rf /home/floral 2>/dev/null || true
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# 3. Set proper permissions
chown -R floral:floral /home/floral
chmod 755 /home/floral

# 4. Clone repository (as floral user)
su - floral << 'ENDUSER'
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
echo "✅ Repository cloned"
ENDUSER

# 5. Create .env.local
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

chown floral:floral /home/floral/floralgifts/.env.local
chmod 600 /home/floral/floralgifts/.env.local

# 6. Install dependencies and build
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
npm install --production
NODE_OPTIONS='--max-old-space-size=4096' npm run build
echo "✅ Build complete"
ENDUSER

# 7. Create PM2 config
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
mkdir -p /home/floral/floralgifts/logs
chown -R floral:floral /home/floral/floralgifts/logs

# 8. Fix PM2 config file (create valid JSON)
echo '{}' > /home/floral/.pm2/module_conf.json 2>/dev/null || true
chown floral:floral /home/floral/.pm2/module_conf.json 2>/dev/null || true

# 9. Start PM2
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
pm2 kill 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 status
ENDUSER

echo "✅ Setup complete!"
