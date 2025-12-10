# Floral Whispers Gifts - Server Deployment Guide

## Server Information

- **Server IP:** `157.245.34.218`
- **Server User:** `floral`
- **Domain:** `floralwhispersgifts.co.ke`
- **App Directory:** `/home/floral/floralgifts`
- **Port:** `3000` (internal, proxied through Nginx)

---

## Prerequisites

1. **Git Repository** - Your code should be in a Git repository (GitHub, GitLab, etc.)
2. **Server Access** - SSH access to the server
3. **Domain DNS** - Domain should point to server IP (`157.245.34.218`)

---

## Step-by-Step Deployment

### Phase 1: Initial Server Setup (One-time)

#### Step 1.1: Connect to Server
```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral
```

#### Step 1.2: Run Server Setup Script
```bash
# Copy server-setup.sh to server or run commands manually
chmod +x scripts/server-setup.sh
./scripts/server-setup.sh
```

**Or run commands manually:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Setup firewall
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

---

### Phase 2: Deploy Application

#### Step 2.1: Clean Up Old Deployment (if exists)
```bash
cd /home/floral
rm -rf floralgifts
```

#### Step 2.2: Clone Repository
```bash
cd /home/floral
git clone YOUR_GIT_REPO_URL floralgifts
cd floralgifts
```

#### Step 2.3: Install Dependencies
```bash
npm install --production
```

#### Step 2.4: Create Environment File
```bash
# Copy environment template
cp env_template.txt .env.local

# Edit .env.local with production values
nano .env.local
```

**Required Environment Variables:**
```env
# Base URL
NEXT_PUBLIC_BASE_URL=https://floralwhispersgifts.co.ke

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Co-op Bank API
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS

# Admin
JWT_SECRET=your-strong-jwt-secret-here
ADMIN_EMAIL=admin@floralwhispersgifts.co.ke
ADMIN_PASSWORD=your-secure-password

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@floralwhispersgifts.co.ke
```

#### Step 2.5: Build Application
```bash
npm run build
```

#### Step 2.6: Create Logs Directory
```bash
mkdir -p logs
```

---

### Phase 3: Setup PM2 Process Manager

#### Step 3.1: Update Ecosystem Config
Ensure `ecosystem.config.js` has correct paths:
```javascript
cwd: '/home/floral/floralgifts',
```

#### Step 3.2: Start Application with PM2
```bash
pm2 start ecosystem.config.js
```

#### Step 3.3: Save PM2 Configuration
```bash
pm2 save
```

#### Step 3.4: Setup PM2 Startup Script
```bash
pm2 startup ubuntu
# Follow the instructions shown
```

#### Step 3.5: Verify PM2 Status
```bash
pm2 status
pm2 logs floralgifts
```

---

### Phase 4: Configure Nginx

#### Step 4.1: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/floralwhispersgifts
```

**Paste the configuration from `nginx/floralwhispersgifts.conf`**

#### Step 4.2: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/floralwhispersgifts /etc/nginx/sites-enabled/
```

#### Step 4.3: Remove Default Site (optional)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

#### Step 4.4: Test Nginx Configuration
```bash
sudo nginx -t
```

#### Step 4.5: Restart Nginx
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

### Phase 5: Setup SSL Certificate

#### Step 5.1: Ensure DNS is Configured
- Verify `floralwhispersgifts.co.ke` points to `157.245.34.218`
- Verify `www.floralwhispersgifts.co.ke` points to `157.245.34.218`

#### Step 5.2: Obtain SSL Certificate
```bash
sudo certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke
```

**Follow prompts:**
- Enter email address
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

#### Step 5.3: Test Certificate Renewal
```bash
sudo certbot renew --dry-run
```

#### Step 5.4: Verify SSL
Visit `https://floralwhispersgifts.co.ke` - should show secure connection

---

### Phase 6: Verify Deployment

#### Step 6.1: Check Application Status
```bash
pm2 status
pm2 logs floralgifts --lines 50
```

#### Step 6.2: Check Nginx Status
```bash
sudo systemctl status nginx
```

#### Step 6.3: Test Application
```bash
# Test locally on server
curl http://localhost:3000

# Test through Nginx
curl http://floralwhispersgifts.co.ke
```

#### Step 6.4: Test HTTPS
```bash
curl https://floralwhispersgifts.co.ke
```

---

## Updating the Application

### Quick Update Process

```bash
# SSH into server
ssh floral@157.245.34.218

# Navigate to app directory
cd /home/floral/floralgifts

# Pull latest changes
git pull origin main  # or your branch name

# Install new dependencies (if any)
npm install --production

# Rebuild application
npm run build

# Restart PM2
pm2 restart floralgifts

# Check logs
pm2 logs floralgifts --lines 50
```

---

## Monitoring & Maintenance

### PM2 Commands
```bash
pm2 status              # Check app status
pm2 logs floralgifts    # View logs
pm2 restart floralgifts # Restart app
pm2 stop floralgifts    # Stop app
pm2 delete floralgifts  # Remove from PM2
pm2 monit               # Monitor resources
```

### Nginx Commands
```bash
sudo systemctl status nginx    # Check status
sudo systemctl restart nginx    # Restart
sudo nginx -t                   # Test config
sudo tail -f /var/log/nginx/error.log  # View error logs
```

### SSL Certificate Renewal
```bash
# Certificates auto-renew, but you can manually renew:
sudo certbot renew

# Test renewal process:
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Application Not Starting
1. Check PM2 logs: `pm2 logs floralgifts`
2. Check environment variables: `cat .env.local`
3. Verify Node.js version: `node --version`
4. Check port 3000 is available: `netstat -tulpn | grep 3000`

### Nginx Not Working
1. Test configuration: `sudo nginx -t`
2. Check error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify Nginx is running: `sudo systemctl status nginx`
4. Check firewall: `sudo ufw status`

### SSL Certificate Issues
1. Verify DNS: `dig floralwhispersgifts.co.ke`
2. Check certificate: `sudo certbot certificates`
3. Test renewal: `sudo certbot renew --dry-run`
4. Check Nginx SSL config: `sudo cat /etc/nginx/sites-available/floralwhispersgifts`

### Can't Access Application
1. Check PM2: `pm2 status`
2. Check Nginx: `sudo systemctl status nginx`
3. Check firewall: `sudo ufw status`
4. Test locally: `curl http://localhost:3000`
5. Check domain DNS: `nslookup floralwhispersgifts.co.ke`

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication (disable password auth)
- [ ] Strong JWT_SECRET in .env.local
- [ ] Strong admin password
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Environment variables secured (.env.local not in git)
- [ ] PM2 running as non-root user
- [ ] Regular system updates
- [ ] Logs monitoring setup

---

## Backup & Recovery

### Backup Application
```bash
# Create backup
tar -czf floralgifts-backup-$(date +%Y%m%d).tar.gz /home/floral/floralgifts

# Backup database (if applicable)
# Your Supabase database should have its own backup system
```

### Restore Application
```bash
# Extract backup
tar -xzf floralgifts-backup-YYYYMMDD.tar.gz -C /home/floral/

# Restore environment
cp .env.local.backup .env.local

# Restart application
pm2 restart floralgifts
```

---

## Support

For deployment issues:
1. Check PM2 logs: `pm2 logs floralgifts`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check system logs: `journalctl -xe`
4. Verify environment variables are set correctly
5. Test each component individually

---

## Quick Reference

**Server:** `floral@157.245.34.218`  
**App Directory:** `/home/floral/floralgifts`  
**PM2 App Name:** `floralgifts`  
**Domain:** `floralwhispersgifts.co.ke`  
**Port:** `3000` (internal)

