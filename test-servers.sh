#!/bin/bash

echo "🧪 Testing Planning Tool Servers"
echo "================================"

# Test backend
echo "📡 Testing Backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:3001"
    echo "📊 Health: $(curl -s http://localhost:3001/api/health)"
else
    echo "❌ Backend is not running"
fi

echo ""

# Test frontend
echo "🌐 Testing Frontend..."
if curl -s -I http://localhost:3000 | head -1 | grep -q "200"; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not running"
fi

echo ""
echo "🎉 Testing complete!"