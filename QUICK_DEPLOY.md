# Quick Deployment Reference

## 🚀 Quick Start

### 1. Connect to Server
```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral
```

### 2. Clean Up & Clone
```bash
cd /home/floral
rm -rf floralgifts
git clone YOUR_REPO_URL floralgifts
cd floralgifts
```

### 3. Install & Build
```bash
npm install --production
cp env_template.txt .env.local
nano .env.local  # Update with production values
npm run build
mkdir -p logs
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup ubuntu  # Follow instructions
```

### 5. Setup Nginx
```bash
sudo cp nginx/floralwhispersgifts.conf /etc/nginx/sites-available/floralwhispersgifts
sudo ln -s /etc/nginx/sites-available/floralwhispersgifts /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL
```bash
sudo certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke
```

## 📋 Environment Variables (Production)

**Co-op Bank API:**
```env
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
```

## 🔄 Update Application
```bash
cd /home/floral/floralgifts
git pull
npm install --production
npm run build
pm2 restart floralgifts
```

## 📊 Check Status
```bash
pm2 status
pm2 logs floralgifts
sudo systemctl status nginx
```

