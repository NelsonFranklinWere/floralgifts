# Quick Fresh Setup - Copy & Paste in Console

## Complete Setup (Run as root in Digital Ocean Console)

Copy and paste this entire block:

```bash
# ============================================
# COMPLETE FRESH SETUP
# ============================================

# Backup existing data
BACKUP_DIR="/root/floral-backup-$(date +%Y%m%d-%H%M%S)" && \
mkdir -p $BACKUP_DIR && \
[ -d /home/floral/floralgifts ] && cp /home/floral/floralgifts/.env.local $BACKUP_DIR/ 2>/dev/null && \
echo "Backup: $BACKUP_DIR" && \

# Stop everything
pm2 kill 2>/dev/null; pkill -9 node 2>/dev/null; systemctl stop nginx 2>/dev/null; \
lsof -ti:3000 | xargs kill -9 2>/dev/null; lsof -ti:3001 | xargs kill -9 2>/dev/null; sleep 2 && \

# Remove old user
userdel -r floral 2>/dev/null; rm -rf /home/floral /var/www/floralgifts 2>/dev/null && \

# Install dependencies
apt update && apt install -y curl git build-essential && \
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt install -y nodejs nginx && \
npm install -g pm2 && \

# Create floral user
useradd -m -s /bin/bash floral && \
echo "floral:Floral@254Floral" | chpasswd && \
usermod -aG sudo floral && \
chown -R floral:floral /home/floral && \

# Setup firewall
ufw --force enable && ufw allow ssh http https && \

# Clone repo
su - floral -c "cd /home/floral && git clone https://github.com/NelsonFranklinWere/floralgifts.git" && \

# Create .env.local (see next section for full content)
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
chown floral:floral /home/floral/floralgifts/.env.local && chmod 600 /home/floral/floralgifts/.env.local && \

# Install and build
su - floral -c "cd /home/floral/floralgifts && npm install --production && NODE_OPTIONS='--max-old-space-size=4096' npm run build" && \

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
chown floral:floral /home/floral/floralgifts/ecosystem.config.js && \
mkdir -p /home/floral/floralgifts/logs && chown -R floral:floral /home/floral/floralgifts/logs && \

# Start PM2
su - floral -c "cd /home/floral/floralgifts && pm2 start ecosystem.config.js && pm2 save" && \

# Configure Nginx
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
ln -sf /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && systemctl start nginx && systemctl enable nginx && \

# Verify
echo "=== PM2 Status ===" && su - floral -c "pm2 status" && \
echo "=== Port Check ===" && netstat -tlnp | grep 3001 && \
echo "=== Test App ===" && curl -s http://localhost:3001 | head -5 && \
echo "✅ Setup complete!"
```

---

## After Setup - Update Environment Variables

```bash
# Edit .env.local to add missing secrets
nano /home/floral/floralgifts/.env.local

# Update these values:
# - COOP_BANK_CONSUMER_SECRET (get from Co-op Bank)
# - MPESA_PASSKEY (get from Safaricom)
# - JWT_SECRET (generate a strong random string)

# After editing, restart PM2
su - floral -c "cd /home/floral/floralgifts && pm2 restart floralgifts"
```

---

## Setup PM2 Startup (Important!)

```bash
# Run this as floral user
su - floral -c "pm2 startup systemd -u floral --hp /home/floral"

# It will output a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u floral --hp /home/floral
# Copy and run that command as root
```

---

## Setup SSL (Optional but Recommended)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke --non-interactive --agree-tos --email whispersfloral@gmail.com
```

---

## Verify Everything Works

```bash
# Check PM2
su - floral -c "pm2 status"
su - floral -c "pm2 logs floralgifts --lines 20"

# Test app
curl http://localhost:3001

# Test domain
curl http://floralwhispersgifts.co.ke

# Check Nginx
systemctl status nginx
```
