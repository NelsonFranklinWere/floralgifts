#!/bin/bash

# Fix PM2 Permissions for floral user
# Run this as root in Digital Ocean Console

# Ensure floral user exists with proper home directory
userdel -r floral 2>/dev/null || true
rm -rf /home/floral 2>/dev/null || true

# Create floral user properly
useradd -m -s /bin/bash floral
echo "floral:Floral@254Floral" | chpasswd
usermod -aG sudo floral

# Fix home directory permissions
chown -R floral:floral /home/floral
chmod 755 /home/floral

# Create PM2 directory structure manually
mkdir -p /home/floral/.pm2/logs
mkdir -p /home/floral/.pm2/pids
mkdir -p /home/floral/.pm2/modules
touch /home/floral/.pm2/module_conf.json
touch /home/floral/.pm2/pm2.log

# Set proper ownership
chown -R floral:floral /home/floral/.pm2
chmod -R 755 /home/floral/.pm2

# Verify
ls -la /home/floral
ls -la /home/floral/.pm2

echo "✅ PM2 directories created with proper permissions"
