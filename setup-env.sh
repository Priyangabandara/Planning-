#!/bin/bash

echo "🚀 Setting up Planning Tool Environment Files"
echo "=============================================="

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Creating from template..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ Frontend .env file not found. Creating from template..."
    cp frontend/.env.example frontend/.env
fi

echo "✅ Environment files created!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your Supabase credentials:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY" 
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - DATABASE_URL"
echo ""
echo "2. Edit frontend/.env with your Supabase credentials:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "3. Run the database schema:"
echo "   - Go to your Supabase dashboard"
echo "   - Run the contents of supabase-schema.sql in the SQL Editor"
echo ""
echo "4. Install dependencies:"
echo "   npm run install:all"
echo ""
echo "5. Start the application:"
echo "   npm run dev"
echo ""
echo "🔗 Your Supabase credentials should be available in your Supabase dashboard:"
echo "   - Project Settings > API"
echo "   - Database > Connection string"