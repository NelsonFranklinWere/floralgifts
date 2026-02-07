#!/bin/bash

# Find and check Nginx configuration
# Run these commands on your server

echo "🔍 Finding Nginx configuration files..."

# Check common locations
echo ""
echo "1. Checking /etc/nginx/sites-available/"
ls -la /etc/nginx/sites-available/ 2>/dev/null || echo "Directory not found"

echo ""
echo "2. Checking /etc/nginx/sites-enabled/"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "Directory not found"

echo ""
echo "3. Checking /etc/nginx/nginx.conf"
if [ -f /etc/nginx/nginx.conf ]; then
    echo "File exists"
    grep -n "proxy_pass\|server_name\|floral" /etc/nginx/nginx.conf | head -20
else
    echo "File not found"
fi

echo ""
echo "4. Checking for any config with 'floral' in name:"
find /etc/nginx -name "*floral*" -o -name "*whispers*" 2>/dev/null

echo ""
echo "5. Checking all .conf files in sites-available:"
find /etc/nginx/sites-available -name "*.conf" 2>/dev/null

echo ""
echo "6. Checking Nginx main config includes:"
grep -r "include" /etc/nginx/nginx.conf 2>/dev/null | grep -v "^#"
