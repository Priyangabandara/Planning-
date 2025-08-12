# Planning Tool - Complete Setup Guide

This guide will help you set up the Planning Tool with Supabase backend and test all CRUD operations.

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   ./setup-supabase.sh
   ```

2. **Follow the Supabase setup instructions**

3. **Test the API:**
   ```bash
   ./test-api.sh
   ```

## 📋 Prerequisites

- Node.js and npm installed
- Supabase account
- Git repository cloned

## 🔧 Environment Configuration

### Backend Configuration (`backend/.env`)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (Supabase)
DATABASE_URL=postgresql://postgres.your-project-ref:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# SSL Configuration for Supabase
SUPABASE_SSL_CA=

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration (`frontend/.env`)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Development Configuration
VITE_DEV_MODE=true
```

## 🗄️ Database Setup

1. **Create Supabase Project:**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run Database Schema:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the script

3. **Verify Tables Created:**
   - `materials` - Material inventory
   - `bom` - Bill of Materials
   - `orders` - Production orders

## 🔄 CRUD Operations

### Materials Management

**Frontend:** `/materials` page
**Backend API:**

- `GET /api/materials` - Fetch all materials
- `PUT /api/materials/:id` - Update material stock quantity

**Features:**
- View all materials with stock levels
- Edit stock quantities inline
- Visual indicators for stock status (out of stock, low stock, etc.)

### Orders Management

**Frontend:** `/planning` page
**Backend API:**

- `GET /api/orders` - Fetch all orders with BOM info
- `POST /api/updateOrder` - Update order dates
- `GET /api/bom/:orderId` - Get BOM for specific order

**Features:**
- Drag-and-drop order management
- Timeline view for production planning
- Material shortage detection
- BOM (Bill of Materials) integration

### Dashboard

**Frontend:** `/` (home page)
**Features:**
- Overview of orders and materials
- Quick statistics
- Navigation to other sections

## 🧪 Testing CRUD Operations

### Automated Testing

Run the test script to verify all operations:

```bash
./test-api.sh
```

This script will test:
- ✅ Backend connectivity
- ✅ Materials CRUD operations
- ✅ Orders CRUD operations
- ✅ BOM operations
- ✅ Frontend connectivity

### Manual Testing

1. **Start the applications:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Test Materials CRUD:**
   - Open http://localhost:3000/materials
   - View materials list
   - Click edit on any material
   - Change stock quantity
   - Save changes

3. **Test Orders CRUD:**
   - Open http://localhost:3000/planning
   - View orders timeline
   - Drag orders to different dates
   - Click on orders to view details
   - Check BOM information

## 🔍 Troubleshooting

### "Tenant or user not found" Error

This error occurs when the database connection is not properly configured:

1. **Check DATABASE_URL format:**
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

2. **Verify Supabase project:**
   - Ensure project is active
   - Check database password
   - Verify connection string from Supabase dashboard

3. **Check environment variables:**
   - Ensure `.env` files exist
   - Verify all credentials are correct
   - Check for typos in project reference

### CORS Errors

1. **Check backend CORS configuration:**
   - Verify `CORS_ORIGIN=http://localhost:3000` in backend/.env
   - Ensure backend is running on port 3001

2. **Check frontend API calls:**
   - Verify `VITE_API_URL=http://localhost:3001/api` in frontend/.env
   - Check browser console for errors

### Database Connection Issues

1. **SSL Configuration:**
   - Supabase requires SSL
   - Backend is configured with `rejectUnauthorized: false`

2. **Row Level Security:**
   - RLS is enabled but policies allow all operations
   - Check Supabase dashboard for RLS policies

## 📊 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/materials` | Fetch all materials |
| PUT | `/api/materials/:id` | Update material stock |
| GET | `/api/orders` | Fetch all orders with BOM |
| POST | `/api/updateOrder` | Update order dates |
| GET | `/api/bom/:orderId` | Get BOM for order |

## 🎯 Next Steps

1. **Customize the application:**
   - Modify database schema as needed
   - Add new CRUD operations
   - Implement user authentication

2. **Enhance features:**
   - Add material procurement workflow
   - Implement order status tracking
   - Add reporting and analytics

3. **Production deployment:**
   - Set up proper environment variables
   - Configure production database
   - Implement proper security measures

## 📞 Support

- Check `SUPABASE_SETUP.md` for detailed Supabase instructions
- Review `README.md` for project overview
- Run `./setup-supabase.sh` for interactive setup guide