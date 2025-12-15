# Remote Deployment Instructions

Since SSH password authentication may be disabled, follow these steps:

## Option 1: Manual SSH Connection

### Step 1: Connect to Server
```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral
```

### Step 2: Copy Deployment Script to Server
Once connected, you can either:

**A. Copy the script content:**
```bash
# On your local machine, copy the script content
cat scripts/server-deploy-test.sh

# Then paste it into a file on the server:
nano /home/floral/deploy-test.sh
# Paste content, save (Ctrl+X, Y, Enter)
chmod +x /home/floral/deploy-test.sh
```

**B. Use SCP to copy the file:**
```bash
# From your local machine
scp scripts/server-deploy-test.sh floral@157.245.34.218:/home/floral/
```

### Step 3: Run Deployment Script on Server
```bash
# On the server
cd /home/floral
chmod +x deploy-test.sh
./deploy-test.sh
```

---

## Option 2: Manual Step-by-Step Commands

If you prefer to run commands manually:

### 1. Connect to Server
```bash
ssh floral@157.245.34.218
```

### 2. Navigate to App Directory
```bash
cd /home/floral/floralgifts
```

### 3. Pull Latest Changes (if using Git)
```bash
git pull origin main  # or your branch name
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Build Application
```bash
npm run build
```

### 6. Create Logs Directory
```bash
mkdir -p logs
```

### 7. Start/Restart PM2
```bash
# If already running
pm2 restart floralgifts

# If not running
pm2 start ecosystem.config.js
pm2 save
```

### 8. Test Token Endpoint
```bash
curl -X POST http://localhost:3000/api/coopbank/token
```

### 9. Test STK Push
```bash
curl -X POST http://localhost:3000/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "MobileNumber": "254743869564",
    "Amount": 10
  }'
```

### 10. Check PM2 Status
```bash
pm2 status
pm2 logs floralgifts --lines 50
```

---

## Option 3: Using SSH Keys (Recommended for Future)

### Setup SSH Key Authentication

**On your local machine:**
```bash
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096

# Copy public key to server
ssh-copy-id floral@157.245.34.218
```

**On the server:**
```bash
# Ensure .ssh directory has correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

After setting up SSH keys, you can run commands directly without passwords.

---

## Testing After Deployment

### Test from Server
```bash
# Test token
curl -X POST http://localhost:3000/api/coopbank/token

# Test STK Push
curl -X POST http://localhost:3000/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{"MobileNumber": "254743869564", "Amount": 10}'
```

### Test from External (if Nginx is configured)
```bash
# From your local machine
curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/token

curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{"MobileNumber": "254743869564", "Amount": 10}'
```

---

## Troubleshooting

### If SSH Connection Fails
1. Verify server IP: `157.245.34.218`
2. Verify username: `floral`
3. Verify password: `Floral@254Floral`
4. Check if SSH service is running: `sudo systemctl status ssh`
5. Check firewall: `sudo ufw status`

### If App Doesn't Start
1. Check environment variables: `cat .env.local`
2. Check Node.js version: `node --version`
3. Check PM2 logs: `pm2 logs floralgifts`
4. Check if port 3000 is available: `netstat -tulpn | grep 3000`

### If STK Push Fails
1. Verify Co-op Bank credentials in `.env.local`
2. Check server logs: `pm2 logs floralgifts`
3. Verify callback URL is accessible
4. Check phone number format (must start with 254)










