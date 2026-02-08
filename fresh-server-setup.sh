#!/bin/bash

# Complete Fresh Server Setup Script
# Run this in Digital Ocean Web Console as root

set -e

echo "🚀 Starting complete fresh server setup..."
echo ""

# Step 1: Backup existing data (if any)
echo "📦 Step 1: Backing up existing data..."
BACKUP_DIR="/root/floral-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

if [ -d /home/floral/floralgifts ]; then
    cp /home/floral/floralgifts/.env.local $BACKUP_DIR/ 2>/dev/null && echo "✅ Backed up .env.local"
    cp /home/floral/floralgifts/ecosystem.config.js $BACKUP_DIR/ 2>/dev/null && echo "✅ Backed up ecosystem.config.js"
fi

echo "Backup location: $BACKUP_DIR"
echo ""

# Step 2: Stop all services
echo "🛑 Step 2: Stopping all services..."
pm2 kill 2>/dev/null || true
pkill -9 node 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2
echo "✅ Services stopped"
echo ""

# Step 3: Remove old user and directories
echo "🗑️  Step 3: Removing old user and directories..."
userdel -r floral 2>/dev/null && echo "✅ Removed old floral user" || echo "No floral user to remove"
rm -rf /home/floral 2>/dev/null || true
rm -rf /var/www/floralgifts 2>/dev/null || true
echo "✅ Cleanup complete"
echo ""

# Step 4: Update system and install dependencies
echo "📦 Step 4: Installing system dependencies..."
apt update && apt upgrade -y
apt install -y curl git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install -y nginx

echo "✅ Dependencies installed"
node --version
npm --version
pm2 --version
echo ""

# Step 5: Create floral user
echo "👤 Step 5: Creating floral user..."
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral
mkdir -p /home/floral/.ssh
chown -R floral:floral /home/floral
echo "✅ floral user created"
echo ""

# Step 6: Setup firewall
echo "🔥 Step 6: Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
ufw status
echo "✅ Firewall configured"
echo ""

# Step 7: Clone repository
echo "📥 Step 7: Cloning repository..."
su - floral << 'ENDUSER'
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
echo "✅ Repository cloned"
ENDUSER
echo ""

# Step 8: Create .env.local with actual values
echo "📝 Step 8: Creating .env.local..."
cat > /home/floral/floralgifts/.env.local << 'ENVEOF'
# ============================================
# FLORAL WHISPERS GIFTS - ENVIRONMENT VARIABLES
# ============================================

# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://sdculxvqvixpiairzukl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTg4NTUsImV4cCI6MjA3ODk5NDg1NX0.8c2ATXh6692Z3mTG7dsWwivB5uIasrtJeGfj9OLgf98
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQxODg1NSwiZXhwIjoyMDc4OTk0ODU1fQ.41RcYn4J5jxjlC9TRltgWgX7ZaH23h7ehGCu9knLa2g

# ============================================
# BASE URL
# ============================================
NEXT_PUBLIC_BASE_URL=https://floralwhispersgifts.co.ke

# ============================================
# M-PESA CONFIGURATION
# ============================================
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=gQE0zykwt3dXyXGemkfSdAGS1G6qGjGxjF5bwCBdGAsSHf0S
MPESA_CONSUMER_SECRET=Hy6TP0ln3i4HoeH84OzVBvtmnRU9bSu0hpfXKQTITXn4uWOvjkL5fTPPkdyLMyMe
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_from_safaricom_portal
MPESA_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/mpesa/callback

# ============================================
# ADMIN AUTHENTICATION
# ============================================
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string
ADMIN_EMAIL=whispersfloral@gmail.com
ADMIN_PASSWORD=Admin@2025

# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================
RESEND_API_KEY=re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR
RESEND_FROM_EMAIL=FloralWebsite@resend.dev

# ============================================
# GOOGLE VERIFICATION (Optional)
# ============================================
GOOGLE_VERIFICATION=

# ============================================
# CO-OP BANK API CONFIGURATION
# ============================================
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=YOUR_ACTUAL_SECRET_HERE
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS

# ============================================
# PESAPAL CONFIGURATION (Card Payments)
# ============================================
PESAPAL_CONSUMER_KEY=zZv8hIaogJH1OP96YfKemq1O5I3TmwSX
PESAPAL_CONSUMER_SECRET=a/POk+ULP7dJurds2FZkf06isn8=
PESAPAL_ENV=production
PESAPAL_IPN_ID=a6b958a3-a851-4521-b148-dadbd540ea64
PESAPAL_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/pesapal/callback
ENVEOF

chown floral:floral /home/floral/floralgifts/.env.local
chmod 600 /home/floral/floralgifts/.env.local
echo "✅ .env.local created"
echo ""

# Step 9: Install npm dependencies and build
echo "📦 Step 9: Installing dependencies and building..."
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
npm install --production
NODE_OPTIONS='--max-old-space-size=4096' npm run build
echo "✅ Build complete"
ENDUSER
echo ""

# Step 10: Create PM2 configuration
echo "⚙️  Step 10: Creating PM2 configuration..."
cat > /home/floral/floralgifts/ecosystem.config.js << 'EOF'
// PM2 Ecosystem Configuration for Floral Whispers Gifts
module.exports = {
  apps: [
    {
      name: 'floralgifts',
      script: 'npm',
      args: 'start',
      cwd: '/home/floral/floralgifts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NODE_OPTIONS: '--max-old-space-size=2048',
      },
      error_file: '/home/floral/floralgifts/logs/pm2-error.log',
      out_file: '/home/floral/floralgifts/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1536M',
    },
  ],
};
EOF

chown floral:floral /home/floral/floralgifts/ecosystem.config.js
mkdir -p /home/floral/floralgifts/logs
chown -R floral:floral /home/floral/floralgifts/logs
echo "✅ PM2 configuration created"
echo ""

# Step 11: Start PM2
echo "🚀 Step 11: Starting PM2..."
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
pm2 start ecosystem.config.js
pm2 save
pm2 status
ENDUSER
echo ""

# Step 12: Setup PM2 startup
echo "⚙️  Step 12: Setting up PM2 startup..."
STARTUP_CMD=$(su - floral -c "pm2 startup systemd -u floral --hp /home/floral" | grep "sudo")
if [ ! -z "$STARTUP_CMD" ]; then
    echo "Run this command to enable PM2 startup:"
    echo "$STARTUP_CMD"
fi
echo ""

# Step 13: Configure Nginx
echo "🌐 Step 13: Configuring Nginx..."
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    client_max_body_size 10M;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl start nginx
systemctl enable nginx
echo "✅ Nginx configured"
echo ""

# Step 14: Final verification
echo "✅ Step 14: Final verification..."
su - floral -c "pm2 status"
echo ""
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001
echo ""
curl -s http://localhost:3001 | head -10 || echo "App not responding yet"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with actual API keys (especially COOP_BANK_CONSUMER_SECRET)"
echo "2. Run PM2 startup command shown above"
echo "3. Setup SSL: certbot --nginx -d floralwhispersgifts.co.ke"
echo "4. Test site: https://floralwhispersgifts.co.ke"
