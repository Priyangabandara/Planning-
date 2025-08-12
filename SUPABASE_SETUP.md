# Supabase Setup Guide

This guide will help you set up your Planning Tool project with Supabase as the database.

## Prerequisites

- Supabase account and project
- Node.js and npm installed
- Git repository cloned

## Step 1: Supabase Project Setup

1. Go to [Supabase](https://supabase.com) and sign in
2. Create a new project or use your existing project
3. Note down your project URL and API keys

## Step 2: Database Schema Setup

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables, indexes, and sample data

## Step 3: Environment Configuration

The `.env` file has been created with your Supabase credentials:

```env
SUPABASE_URL=https://oobhwudydwdfnqjthzta.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_connection_string
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Application

### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

### Backend Only
```bash
npm run server
```

### Frontend Only
```bash
npm run dev
```

## Database Structure

### Tables

1. **materials** - Stores material inventory
   - `material_id` - Unique identifier
   - `material_name` - Name of the material
   - `stock_qty` - Current stock quantity
   - `created_at`, `updated_at` - Timestamps

2. **bom** - Bill of Materials
   - `bom_id` - Unique identifier
   - `material_id` - Reference to materials table
   - `qty_required` - Quantity required for production

3. **orders** - Production orders
   - `order_id` - Unique identifier
   - `order_name` - Name of the order
   - `start_date`, `end_date` - Production timeline
   - `bom_id` - Reference to BOM
   - `status` - Order status (pending, in_progress, completed, cancelled, shortage)

## API Endpoints

- `GET /api/orders` - Fetch all orders with BOM info
- `POST /api/updateOrder` - Update order dates
- `GET /api/bom/:orderId` - Get BOM for specific order
- `GET /api/materials` - Get all materials
- `PUT /api/materials/:id` - Update material stock
- `GET /api/health` - Health check

## Row Level Security (RLS)

The database has RLS enabled with policies that currently allow all operations. You can customize these policies based on your authentication requirements.

## Troubleshooting

### Connection Issues
- Ensure your `.env` file is properly configured
- Check that your Supabase project is active
- Verify the database connection string format

### Database Errors
- Check the SQL Editor in Supabase for any error messages
- Ensure all tables were created successfully
- Verify sample data was inserted

### SSL Issues
- The connection is configured to use SSL with `rejectUnauthorized: false`
- This is required for Supabase connections

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- The service role key has elevated permissions - use with caution
- Consider implementing proper authentication and authorization
- Review and customize RLS policies based on your security requirements

## Next Steps

1. Test the API endpoints
2. Customize the database schema if needed
3. Implement user authentication
4. Add more sophisticated RLS policies
5. Set up database backups and monitoring