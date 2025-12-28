# Deploy Now - Quick Instructions

## 🚀 Quick Deployment Steps

### Step 1: Connect to Server Manually

Open your terminal and run:
```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral
```

### Step 2: Once Connected, Run These Commands

```bash
# Navigate to app directory
cd /home/floral/floralgifts

# Install dependencies
npm install --production

# Build application
npm run build

# Create logs directory
mkdir -p logs

# Start/Restart PM2
pm2 restart floralgifts || pm2 start ecosystem.config.js

# Wait a few seconds
sleep 5

# Test Token endpoint
echo "Testing Token..."
curl -X POST http://localhost:3000/api/coopbank/token

# Test STK Push with phone: 254743869564
echo "Testing STK Push..."
curl -X POST http://localhost:3000/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{"MobileNumber": "254743869564", "Amount": 10}'

# Check PM2 status
pm2 status

# View logs
pm2 logs floralgifts --lines 30
```

### Step 3: Check Your Phone

After running the STK Push test, check phone number **0743869564** for the M-Pesa prompt.

---

## 📋 Copy-Paste Ready Script

You can copy this entire block and paste it into your SSH session:

```bash
cd /home/floral/floralgifts && \
npm install --production && \
npm run build && \
mkdir -p logs && \
pm2 restart floralgifts || pm2 start ecosystem.config.js && \
sleep 5 && \
echo "=== Testing Token ===" && \
curl -X POST http://localhost:3000/api/coopbank/token && \
echo "" && \
echo "=== Testing STK Push ===" && \
curl -X POST http://localhost:3000/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{"MobileNumber": "254743869564", "Amount": 10}' && \
echo "" && \
echo "=== PM2 Status ===" && \
pm2 status && \
echo "=== Recent Logs ===" && \
pm2 logs floralgifts --lines 20 --nostream
```

---

## ✅ Expected Results

### Token Endpoint Response:
```json
{
  "success": true,
  "access_token": "eyJ4NXQiOiJOekUxTUdaaVpHTTVaRGd4TURWbE1qRmtObVZoT0dVMU9XVXpZVEJrWlRrMk5UWXpOVFEwT1RNME5EaGlNREU0WkRrM1lUaGhZekl4WmpnNVptUTNPUSIs...",
  "message": "Token retrieved successfully"
}
```

### STK Push Response:
```json
{
  "success": true,
  "data": {
    "MessageReference": "FLORAL-1234567890",
    "ResponseCode": "0",
    "ResponseDescription": "Success",
    "RequestID": "12345-67890-12345"
  }
}
```

---

## 🔍 Troubleshooting

### If Token Fails:
- Check `.env.local` file has `COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a`
- Verify environment variables are loaded: `cat .env.local | grep COOP_BANK`

### If STK Push Fails:
- Check PM2 logs: `pm2 logs floralgifts`
- Verify callback URL is set: `echo $COOP_BANK_CALLBACK_URL`
- Check phone number format (must be 254743869564)

### If App Doesn't Start:
- Check Node.js: `node --version`
- Check PM2: `pm2 list`
- Check port: `netstat -tulpn | grep 3000`

---

## 📱 After Testing

Once STK Push succeeds:
1. ✅ Check phone **0743869564** for M-Pesa prompt
2. ✅ Enter PIN and confirm payment
3. ✅ Check server logs for callback: `pm2 logs floralgifts`
4. ✅ Verify payment status using MessageReference

---

**Ready to deploy!** Connect to server and run the commands above.














