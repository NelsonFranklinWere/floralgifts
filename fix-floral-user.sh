#!/bin/bash

# Fix floral user and complete setup
# Run this in Digital Ocean Console

# Fix floral user home directory
userdel -r floral 2>/dev/null || true
rm -rf /home/floral 2>/dev/null || true

# Create floral user properly
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# Set proper permissions
chown -R floral:floral /home/floral
chmod 755 /home/floral

# Clone repository
su - floral << 'ENDUSER'
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
echo "✅ Repository cloned"
ENDUSER

# Create .env.local
cat > /home/floral/floralgifts/.env.local << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://sdculxvqvixpiairzukl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTg4NTUsImV4cCI6MjA3ODk5NDg1NX0.8c2ATXh6692Z3mTG7dsWwivB5uIasrtJeGfj9OLgf98
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQxODg1NSwiZXhwIjoyMDc4OTk0ODU1fQ.41RcYn4J5jxjlC9TRltgWgX7ZaH23h7ehGCu9knLa2g
NEXT_PUBLIC_BASE_URL=https://floralwhispersgifts.co.ke
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=gQE0zykwt3dXyXGemkfSdAGS1G6qGjGxjF5bwCBdGAsSHf0S
MPESA_CONSUMER_SECRET=Hy6TP0ln3i4HoeH84OzVBvtmnRU9bSu0hpfXKQTITXn4uWOvjkL5fTPPkdyLMyMe
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_from_safaricom_portal
MPESA_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/mpesa/callback
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string
ADMIN_EMAIL=whispersfloral@gmail.com
ADMIN_PASSWORD=Admin@2025
RESEND_API_KEY=re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR
RESEND_FROM_EMAIL=FloralWebsite@resend.dev
GOOGLE_VERIFICATION=
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=YOUR_ACTUAL_SECRET_HERE
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
PESAPAL_CONSUMER_KEY=zZv8hIaogJH1OP96YfKemq1O5I3TmwSX
PESAPAL_CONSUMER_SECRET=a/POk+ULP7dJurds2FZkf06isn8=
PESAPAL_ENV=production
PESAPAL_IPN_ID=a6b958a3-a851-4521-b148-dadbd540ea64
PESAPAL_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/pesapal/callback
ENVEOF

chown floral:floral /home/floral/floralgifts/.env.local
chmod 600 /home/floral/floralgifts/.env.local

# Install dependencies and build
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
npm install --production
NODE_OPTIONS='--max-old-space-size=4096' npm run build
ENDUSER

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
mkdir -p /home/floral/floralgifts/logs
chown -R floral:floral /home/floral/floralgifts/logs

# Start PM2
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
pm2 start ecosystem.config.js
pm2 save
pm2 status
ENDUSER

echo "✅ Setup complete!"
