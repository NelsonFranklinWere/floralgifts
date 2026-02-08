# Complete Fresh Server Setup Guide
# Run these commands in Digital Ocean Web Console (as root)

## Step 1: Backup Current Environment Variables (if any exist)

```bash
# Check if floral user exists and backup their files
if [ -d /home/floral/floralgifts ]; then
    BACKUP_DIR="/root/floral-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup .env files
    cp /home/floral/floralgifts/.env.local $BACKUP_DIR/ 2>/dev/null && echo "✅ Backed up .env.local"
    cp /home/floral/floralgifts/.env $BACKUP_DIR/ 2>/dev/null && echo "✅ Backed up .env"
    
    echo "Backup location: $BACKUP_DIR"
    ls -la $BACKUP_DIR
else
    echo "No existing floral user found, proceeding with fresh setup"
fi
```

---

## Step 2: Stop All Services

```bash
# Stop PM2
pm2 kill 2>/dev/null || true
pkill -9 node 2>/dev/null || true

# Stop Nginx (temporarily)
systemctl stop nginx 2>/dev/null || true

# Kill anything on ports 3000/3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

sleep 2
echo "✅ All services stopped"
```

---

## Step 3: Remove Old floral User and Project

```bash
# Remove PM2 processes
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Remove old floral user (if exists)
userdel -r floral 2>/dev/null && echo "✅ Removed old floral user" || echo "No floral user to remove"

# Remove old project directories
rm -rf /home/floral 2>/dev/null || true
rm -rf /var/www/floralgifts 2>/dev/null || true

echo "✅ Old user and projects removed"
```

---

## Step 4: Create Fresh floral User

```bash
# Create floral user with home directory
useradd -m -s /bin/bash floral

# Add floral to sudo group (optional, for convenience)
usermod -aG sudo floral

# Set password for floral user (change 'Floral@254Floral' to your preferred password)
echo "floral:Floral@254Floral" | chpasswd

# Create necessary directories
mkdir -p /home/floral/floralgifts
mkdir -p /home/floral/.ssh
chown -R floral:floral /home/floral

echo "✅ floral user created"
id floral
```

---

## Step 5: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Git (if not already installed)
apt install -y git

# Install Nginx (if not already installed)
apt install -y nginx

# Install build essentials (for native modules)
apt install -g build-essential

# Verify installations
node --version
npm --version
pm2 --version
git --version
nginx -v

echo "✅ Software installed"
```

---

## Step 6: Setup Firewall

```bash
# Configure UFW firewall
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3001/tcp  # Allow PM2 port (optional, Nginx handles it)
ufw status

echo "✅ Firewall configured"
```

---

## Step 7: Clone Repository as floral User

```bash
# Switch to floral user and clone
su - floral << 'ENDUSER'
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
echo "✅ Repository cloned"
ls -la
ENDUSER
```

---

## Step 8: Create Environment Variables File

```bash
# Create .env.local file
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
# PESAPAL CONFIGURATION
# ============================================
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_IPN_ID=your_pesapal_ipn_id
PESAPAL_ENV=sandbox

# ============================================
# RESEND EMAIL CONFIGURATION
# ============================================
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@floralwhispersgifts.co.ke

# ============================================
# JWT SECRET
# ============================================
JWT_SECRET=your_jwt_secret_change_this

# ============================================
# GOOGLE ANALYTICS
# ============================================
GOOGLE_VERIFICATION=your_google_verification_code
ENVEOF

# Set proper permissions
chown floral:floral /home/floral/floralgifts/.env.local
chmod 600 /home/floral/floralgifts/.env.local

echo "✅ .env.local created"
echo "⚠️  IMPORTANT: Edit .env.local and add your actual API keys!"
echo "Run: nano /home/floral/floralgifts/.env.local"
```

---

## Step 9: Install Dependencies and Build

```bash
# Switch to floral user for npm operations
su - floral << 'ENDUSER'
cd /home/floral/floralgifts

# Install dependencies
npm install --production

# Build application
NODE_OPTIONS='--max-old-space-size=4096' npm run build

echo "✅ Build complete"
ENDUSER
```

---

## Step 10: Create PM2 Configuration

```bash
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

# Set permissions
chown floral:floral /home/floral/floralgifts/ecosystem.config.js

# Create logs directory
mkdir -p /home/floral/floralgifts/logs
chown -R floral:floral /home/floral/floralgifts/logs

echo "✅ PM2 configuration created"
```

---

## Step 11: Start PM2 as floral User

```bash
# Start PM2 as floral user
su - floral << 'ENDUSER'
cd /home/floral/floralgifts
pm2 start ecosystem.config.js
pm2 save

echo "✅ PM2 started"
pm2 status
ENDUSER

# Setup PM2 to start on boot
su - floral -c "pm2 startup systemd -u floral --hp /home/floral"
# Run the command it outputs (usually involves sudo)
```

---

## Step 12: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/floralwhispersgifts.co.ke << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name floralwhispersgifts.co.ke www.floralwhispersgifts.co.ke;

    # Proxy to Next.js app
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

    # Increase body size limit for file uploads
    client_max_body_size 10M;
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/

# Remove default site (optional)
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx

echo "✅ Nginx configured"
```

---

## Step 13: Setup SSL with Certbot (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace email with your email)
certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke --non-interactive --agree-tos --email your-email@example.com

# Test auto-renewal
certbot renew --dry-run

echo "✅ SSL configured"
```

---

## Step 14: Final Verification

```bash
# Check PM2 status
su - floral -c "pm2 status"

# Check if app is running
curl http://localhost:3001 | head -20

# Check Nginx status
systemctl status nginx

# Check port
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

# Test domain (if DNS is configured)
curl http://floralwhispersgifts.co.ke | head -20

echo ""
echo "✅ Setup complete!"
```

---

## Step 15: Update Environment Variables

```bash
# Edit .env.local to add your actual API keys
nano /home/floral/floralgifts/.env.local

# After editing, restart PM2
su - floral -c "cd /home/floral/floralgifts && pm2 restart floralgifts"
```

---

## Important Notes

1. **Environment Variables**: Make sure to update `.env.local` with your actual API keys
2. **PM2 Startup**: Run the command output by `pm2 startup` to enable auto-start on reboot
3. **SSH Access**: To enable SSH for floral user:
   ```bash
   # Copy your SSH key (if you have one)
   mkdir -p /home/floral/.ssh
   nano /home/floral/.ssh/authorized_keys
   # Paste your public SSH key
   chmod 700 /home/floral/.ssh
   chmod 600 /home/floral/.ssh/authorized_keys
   chown -R floral:floral /home/floral/.ssh
   ```

4. **Password**: Change the password set in Step 4 for security

---

## Quick All-in-One Script

```bash
# Run this entire block at once
BACKUP_DIR="/root/floral-backup-$(date +%Y%m%d-%H%M%S)" && \
mkdir -p $BACKUP_DIR && \
[ -d /home/floral/floralgifts ] && cp /home/floral/floralgifts/.env.local $BACKUP_DIR/ 2>/dev/null && \
pm2 kill && pkill -9 node && userdel -r floral 2>/dev/null; \
rm -rf /home/floral && \
useradd -m -s /bin/bash floral && \
echo "floral:Floral@254Floral" | chpasswd && \
apt update && apt install -y nodejs npm git nginx build-essential && \
npm install -g pm2 && \
su - floral -c "cd /home/floral && git clone https://github.com/NelsonFranklinWere/floralgifts.git" && \
echo "✅ Basic setup complete. Continue with environment variables and build steps."
```
