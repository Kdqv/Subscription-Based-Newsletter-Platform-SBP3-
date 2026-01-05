#!/bin/bash

echo "🌐 Finding your local IP address..."

# Get the local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "✅ Your local IP is: $LOCAL_IP"
echo ""
echo "📱 To access from mobile phone:"
echo "1. Make sure your phone and computer are on the same WiFi network"
echo "2. Start your backend server on port 5000"
echo "3. Start your frontend server on port 3000"
echo "4. On your phone, open: http://$LOCAL_IP:3000"
echo ""
echo "🔧 If it doesn't work, try:"
echo "   - Check firewall settings"
echo "   - Make sure both servers are running"
echo "   - Verify you're on the same WiFi network"
