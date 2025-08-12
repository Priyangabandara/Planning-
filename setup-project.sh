#!/bin/bash

echo "🚀 Planning Tool - Complete Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Creating from template..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    print_warning "Frontend .env file not found. Creating from template..."
    cp frontend/.env.example frontend/.env
fi

print_status "Environment files created!"

echo ""
print_info "📝 Manual Configuration Required:"
echo ""
echo "1. Edit backend/.env with your Supabase credentials:"
echo "   - SUPABASE_URL (from your Supabase dashboard)"
echo "   - SUPABASE_ANON_KEY (from Project Settings > API)"
echo "   - SUPABASE_SERVICE_ROLE_KEY (from Project Settings > API)"
echo "   - DATABASE_URL (from Database > Connection string)"
echo ""
echo "2. Edit frontend/.env with your Supabase credentials:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""

# Ask user if they want to proceed with database setup
read -p "🤔 Do you want to set up the database tables now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_info "Setting up database..."
    
    # Check if backend dependencies are installed
    if [ ! -d "backend/node_modules" ]; then
        print_warning "Backend dependencies not installed. Installing..."
        cd backend && npm install && cd ..
    fi
    
    # Run database setup
    cd backend
    npm run setup-db
    cd ..
    
    echo ""
    print_status "Database setup completed!"
else
    echo ""
    print_info "You can set up the database later by running:"
    echo "   cd backend && npm run setup-db"
fi

echo ""
print_info "📦 Installing dependencies..."
npm run install:all

echo ""
print_status "Setup completed!"
echo ""
print_info "🚀 To start the application:"
echo "   npm run dev"
echo ""
print_info "🔗 Your Supabase credentials can be found in:"
echo "   - Project Settings > API (for URL and keys)"
echo "   - Database > Connection string (for DATABASE_URL)"
echo ""
print_info "📊 Database schema is in:"
echo "   - backend/database.sql"
echo "   - supabase-schema.sql (for Supabase SQL Editor)"