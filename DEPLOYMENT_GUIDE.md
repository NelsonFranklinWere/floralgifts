# Complete Deployment Guide - Digital Ocean with PM2, NGINX & SSL

Follow these steps exactly to deploy your Next.js app to Digital Ocean.

---

## Step 1: Sign up for Digital Ocean

Sign up at Digital Ocean. If you use a referral link, you get $10 free credit.

---

## Step 2: Create a Droplet and Log In

1. Create a new droplet (Ubuntu 24.04 LTS recommended)
2. Choose your plan (minimum 1GB RAM recommended for Next.js builds)
3. Add your SSH key or set a root password
4. Log in via SSH:
   ```bash
   ssh root@your_server_ip
   # OR
   ssh root@64.227.50.213
   ```

**Note:** We'll create a `floral` user later, but start as root.

---

## Step 3: Install Node.js and NPM

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Should show Node.js v18.x.x and npm 9.x.x or higher
```

---

## Step 4: Create floral User (Recommended)

```bash
# Create floral user
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# Switch to floral user
su - floral
```

---

## Step 5: Clone Your Project from GitHub

```bash
# As floral user
cd /home/floral
git clone https://github.com/NelsonFranklinWere/floralgifts.git
cd floralgifts
```

---

## Step 6: Create Environment Variables File

```bash
# Create .env.local file
nano /home/floral/floralgifts/.env.local
```

Paste this content (update with your actual values):

```env
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
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 7: Install Dependencies and Test App

```bash
# Install dependencies (production only)
cd /home/floral/floralgifts
npm install --production

# Build the application
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# Test the app (runs on port 3000 by default)
npm start

# You should see:
# ▲ Next.js 16.1.6
# - Local:        http://localhost:3000
# ✓ Ready in XXXms

# Test it works
curl http://localhost:3000

# Stop the app
Ctrl+C
```

---

## Step 8: Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem config
cd /home/floral/floralgifts
nano ecosystem.config.js
```

Paste this:

```javascript
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
```

Save and exit.

```bash
# Create logs directory
mkdir -p /home/floral/floralgifts/logs

# Start app with PM2
pm2 start ecosystem.config.js

# PM2 Commands:
pm2 show floralgifts    # Show app details
pm2 status              # Show status
pm2 restart floralgifts # Restart app
pm2 stop floralgifts    # Stop app
pm2 logs                # Show log stream
pm2 logs floralgifts    # Show logs for specific app
pm2 flush               # Clear logs

# Make sure app starts when server reboots
pm2 startup ubuntu

# It will output a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u floral --hp /home/floral
# Copy and run that command

# Save PM2 process list
pm2 save
```

**Test:** Your app should now be running on port 3001. Test with:
```bash
curl http://localhost:3001
```

---

## Step 9: Setup UFW Firewall

```bash
# Enable firewall
sudo ufw enable

# Check status
sudo ufw status

# Allow SSH (important - do this first!)
sudo ufw allow ssh    # Port 22

# Allow HTTP and HTTPS
sudo ufw allow http    # Port 80
sudo ufw allow https   # Port 443

# Check status again
sudo ufw status

# You should see:
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

---

## Step 10: Install NGINX and Configure

```bash
# Install NGINX
sudo apt install -y nginx

# Create NGINX configuration
sudo nano /etc/nginx/sites-available/floralwhispersgifts.co.ke
```

Paste this configuration:

```nginx
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

    # Increase body size limit for file uploads
    client_max_body_size 10M;
}
```

Save and exit.

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Check NGINX configuration
sudo nginx -t

# Should show:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart NGINX
sudo systemctl restart nginx

# Enable NGINX to start on boot
sudo systemctl enable nginx

# Check NGINX status
sudo systemctl status nginx
```

**Test:** You should now be able to access your app via your server IP (no port):
```bash
curl http://your_server_ip
# OR
curl http://64.227.50.213
```

---

## Step 11: Add Domain in Digital Ocean

1. Go to Digital Ocean Dashboard → **Networking** → **Domains**
2. Click **Add Domain**
3. Enter: `floralwhispersgifts.co.ke`
4. Add **A Records**:
   - **Hostname:** `@` → Points to: `64.227.50.213`
   - **Hostname:** `www` → Points to: `64.227.50.213`
5. Click **Create Record**

---

## Step 12: Configure Domain at Registrar

If your domain is registered elsewhere (e.g., Namecheap, GoDaddy):

1. Log into your domain registrar
2. Go to DNS settings
3. Change nameservers to:
   - `ns1.digitalocean.com`
   - `ns2.digitalocean.com`
   - `ns3.digitalocean.com`
4. OR add A records pointing to `64.227.50.213`

**Note:** DNS propagation can take 24-48 hours, but usually works within minutes.

---

## Step 13: Add SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke

# Follow the prompts:
# - Enter your email address
# - Agree to terms (A)
# - Choose whether to redirect HTTP to HTTPS (recommended: 2)

# Test certificate renewal (certificates expire after 90 days)
sudo certbot renew --dry-run

# Certbot automatically sets up auto-renewal via cron
```

**Test:** Visit `https://floralwhispersgifts.co.ke` - you should see your app with SSL!

---

## Step 14: Verify Everything Works

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs floralgifts --lines 20

# Test app locally
curl http://localhost:3001

# Test via NGINX
curl http://localhost
curl https://floralwhispersgifts.co.ke

# Check NGINX status
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

---

## Troubleshooting

### PM2 App Not Starting

```bash
# Check logs
pm2 logs floralgifts

# Restart app
pm2 restart floralgifts

# Check if port is in use
sudo netstat -tlnp | grep 3001
```

### NGINX Not Working

```bash
# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Test NGINX config
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check auto-renewal
sudo systemctl status certbot.timer
```

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>
```

---

## Quick Reference Commands

```bash
# PM2
pm2 status
pm2 restart floralgifts
pm2 logs floralgifts
pm2 stop floralgifts
pm2 start ecosystem.config.js

# NGINX
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx

# SSL
sudo certbot renew
sudo certbot certificates

# Firewall
sudo ufw status
sudo ufw allow ssh
```

---

## Summary

✅ Node.js installed  
✅ Project cloned  
✅ Dependencies installed  
✅ App built  
✅ PM2 running app  
✅ Firewall configured  
✅ NGINX configured as reverse proxy  
✅ Domain configured  
✅ SSL certificate installed  

Your app should now be live at: **https://floralwhispersgifts.co.ke**
