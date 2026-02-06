#!/usr/bin/expect -f

# Automated Deployment Script using Expect
# This script automates SSH password entry

set timeout 30
set server_user "floral"
set server_ip "157.245.34.218"
set server_password "Floral@254Floral"
set test_phone "254743869564"

spawn ssh -o StrictHostKeyChecking=no $server_user@$server_ip

expect {
    "password:" {
        send "$server_password\r"
        exp_continue
    }
    "Permission denied" {
        puts "❌ Authentication failed. Please check credentials."
        exit 1
    }
    "$ " {
        puts "✅ Connected to server"
    }
    timeout {
        puts "❌ Connection timeout"
        exit 1
    }
}

# Navigate to app directory
send "cd /home/floral/floralgifts\r"
expect "$ "

# Install dependencies
send "npm install --production\r"
expect "$ "

# Build application
send "npm run build\r"
expect "$ "

# Create logs directory
send "mkdir -p logs\r"
expect "$ "

# Restart PM2
send "pm2 restart floralgifts || pm2 start ecosystem.config.js\r"
expect "$ "

# Wait for app to start
send "sleep 5\r"
expect "$ "

# Test Token endpoint
send "echo 'Testing Token endpoint...'\r"
expect "$ "
send "curl -s -X POST http://localhost:3000/api/coopbank/token | head -c 200\r"
expect "$ "
send "echo ''\r"
expect "$ "

# Test STK Push
send "echo 'Testing STK Push with phone: $test_phone...'\r"
expect "$ "
send "curl -s -X POST http://localhost:3000/api/coopbank/stkpush -H 'Content-Type: application/json' -d '{\"MobileNumber\": \"$test_phone\", \"Amount\": 10}'\r"
expect "$ "

# Check PM2 status
send "pm2 status\r"
expect "$ "

# Show recent logs
send "pm2 logs floralgifts --lines 10 --nostream\r"
expect "$ "

send "exit\r"
expect eof














