# Planning Tool

A modern planning tool with Node.js backend API and React frontend for managing orders, materials, and production planning.

## 🏗️ Project Structure

```
planning-tool/
├── backend/                 # Node.js API Server
│   ├── index.js            # Express server
│   ├── database.sql        # Database schema
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Backend environment template
├── frontend/               # React Frontend
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Frontend environment template
├── package.json            # Root package.json for scripts
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set up Environment Files
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database connection

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

### 3. Set up Database
```bash
# Create database
createdb planning_tool

# Run the schema
psql planning_tool < backend/database.sql
```

### 4. Start Development Servers
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend on http://localhost:3000

## 📁 Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for all services
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only backend server
- `npm run dev:frontend` - Start only frontend server
- `npm run build` - Build frontend for production
- `npm run start` - Start backend in production mode

### Backend
- `cd backend && npm run dev` - Start backend with nodemon
- `cd backend && npm start` - Start backend in production

### Frontend
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run lint` - Run ESLint
- `cd frontend && npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/planning_tool

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Development Configuration
VITE_DEV_MODE=true
```

## 🎯 Core Features

### Planning Board
- **Timeline View**: 30-day visual timeline with daily slots
- **Drag & Drop**: Move orders between dates with real-time updates
- **BOM Checking**: Automatic material availability verification
- **Status Indicators**: Color-coded order status (green/red)
- **Order Details**: Click to view detailed BOM information

### Materials Management
- **Stock Tracking**: Real-time inventory levels
- **Status Categories**: Good stock, low stock, out of stock
- **Quick Updates**: Inline editing of stock quantities
- **Visual Indicators**: Progress bars and status icons

## 🗄️ Database Schema

### Orders Table
```sql
orders | order_id | order_name | start_date | end_date | bom_id | status
```

### BOM Table
```sql
bom | bom_id | material_id | qty_required
```

### Materials Table
```sql
materials | material_id | material_name | stock_qty
```

## 🔌 API Endpoints

- `GET /api/orders` - Fetch orders with BOM information
- `POST /api/updateOrder` - Update order start/end dates
- `GET /api/bom/:orderId` - Get BOM details for specific order
- `GET /api/materials` - Get all materials with stock levels
- `PUT /api/materials/:id` - Update material stock quantity
- `GET /api/health` - Health check endpoint

## 🎨 Design System

- **Color Coding**: Green (available), Red (shortage), Orange (low stock)
- **Typography**: Inter font family for readability
- **Spacing**: Consistent 4px grid system
- **Animations**: Smooth transitions and drag feedback
- **Responsive**: Mobile-first design approach

## 🛠️ Development

### Backend Development
The backend is built with:
- **Node.js** with Express.js
- **PostgreSQL** database
- **CORS** enabled for frontend communication
- **Environment-based configuration**

### Frontend Development
The frontend is built with:
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Beautiful DnD** for drag and drop
- **React Router** for navigation

## 📦 Production Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve the dist/ folder with your web server
```

## 🔒 Security Notes

- Keep your `.env` files secure and never commit them to version control
- The `.env` files are already in `.gitignore`
- Use strong database passwords in production
- Configure CORS properly for production environments
