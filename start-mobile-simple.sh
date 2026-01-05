#!/bin/bash

echo "🚀 Starting servers for mobile access..."

# Start backend on all interfaces (0.0.0.0)
echo "📡 Starting backend server on all interfaces..."
cd Backend
node src/server.js &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend on all interfaces
echo "🌐 Starting frontend server on all interfaces..."
cd ../Frontend
npx start --host 0.0.0.0 &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "📱 Access from mobile: http://10.4.2.127:3000"
echo "💻 Access from computer: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
