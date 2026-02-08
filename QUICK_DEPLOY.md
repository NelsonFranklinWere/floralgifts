# Quick Deploy Commands - Copy & Paste

## Complete Setup (Run as root in Digital Ocean Console)

```bash
# ============================================
# STEP 1: Update System
# ============================================
apt update && apt upgrade -y

# ============================================
# STEP 2: Install Node.js 18.x
# ============================================
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version
npm --version

# ============================================
# STEP 3: Create floral User
# ============================================
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# ============================================
# STEP 4: Clone Repository
# ============================================
su - floral -c "cd /home/floral && git clone https://github.com/NelsonFranklinWere/floralgifts.git"

# ============================================
# STEP 5: Create .env.local
# ============================================
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
chown floral:floral /home/floral/floralgifts/.env.local && chmod 600 /home/floral/floralgifts/.env.local

# ============================================
# STEP 6: Install Dependencies and Build
# ============================================
su - floral -c "cd /home/floral/floralgifts && npm install --production && NODE_OPTIONS='--max-old-space-size=4096' npm run build"

# ============================================
# STEP 7: Install PM2
# ============================================
npm install -g pm2

# ============================================
# STEP 8: Create PM2 Config
# ============================================
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

# ============================================
# STEP 9: Start PM2
# ============================================
su - floral -c "cd /home/floral/floralgifts && pm2 start ecosystem.config.js && pm2 save"

# Setup PM2 startup (run the command it outputs)
su - floral -c "pm2 startup ubuntu"

# ============================================
# STEP 10: Setup Firewall
# ============================================
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
ufw status

# ============================================
# STEP 11: Install and Configure NGINX
# ============================================
apt install -y nginx

cat > /etc/nginx/sites-available/floralwhispersgifts.co.ke << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name floralwhispersgifts.co.ke www.floralwhispersgifts.co.ke;
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    client_max_body_size 10M;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# ============================================
# STEP 12: Install SSL (Let's Encrypt)
# ============================================
apt install -y certbot python3-certbot-nginx
certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke --non-interactive --agree-tos --email whispersfloral@gmail.com --redirect

# Test renewal
certbot renew --dry-run

# ============================================
# VERIFY
# ============================================
echo "=== PM2 Status ===" && su - floral -c "pm2 status" && \
echo "=== NGINX Status ===" && systemctl status nginx --no-pager && \
echo "=== Test App ===" && curl -s http://localhost:3001 | head -5 && \
echo "✅ Deployment complete!"
```

---

## After Setup - Update Environment Variables

```bash
# Edit .env.local to add missing secrets
nano /home/floral/floralgifts/.env.local

# Update:
# - COOP_BANK_CONSUMER_SECRET
# - MPESA_PASSKEY
# - JWT_SECRET (generate a strong random string)

# Restart PM2 after changes
su - floral -c "cd /home/floral/floralgifts && pm2 restart floralgifts"
```

---

## Daily Operations

### Update Code
```bash
su - floral
cd /home/floral/floralgifts
git pull origin main
npm install --production
NODE_OPTIONS='--max-old-space-size=4096' npm run build
pm2 restart floralgifts
```

### Check Logs
```bash
su - floral -c "pm2 logs floralgifts"
```

### Restart Services
```bash
su - floral -c "pm2 restart floralgifts"
sudo systemctl restart nginx
```
