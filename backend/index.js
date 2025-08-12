import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection - Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// API Routes

// GET /orders - Fetch orders with BOM info
app.get('/api/orders', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.order_name,
        o.start_date,
        o.end_date,
        o.bom_id,
        o.status,
        json_agg(
          json_build_object(
            'material_id', m.material_id,
            'material_name', m.material_name,
            'qty_required', b.qty_required,
            'stock_qty', m.stock_qty,
            'available', m.stock_qty >= b.qty_required
          )
        ) as bom_items
      FROM orders o
      LEFT JOIN bom b ON o.bom_id = b.bom_id
      LEFT JOIN materials m ON b.material_id = m.material_id
      GROUP BY o.order_id, o.order_name, o.start_date, o.end_date, o.bom_id, o.status
      ORDER BY o.start_date
    `;
    
    const result = await pool.query(query);
    
    // Process the results to determine overall availability
    const orders = result.rows.map(order => {
      const bomItems = order.bom_items || [];
      const hasShortage = bomItems.some(item => !item.available);
      
      return {
        ...order,
        hasShortage,
        status: hasShortage ? 'shortage' : 'available'
      };
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /updateOrder - Save new start/end dates
app.post('/api/updateOrder', async (req, res) => {
  try {
    const { orderId, startDate, endDate } = req.body;
    
    if (!orderId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const query = `
      UPDATE orders 
      SET start_date = $1, end_date = $2, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [startDate, endDate, orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET /bom/:order_id - Get materials and quantities for a specific order
app.get('/api/bom/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const query = `
      SELECT 
        m.material_id,
        m.material_name,
        b.qty_required,
        m.stock_qty,
        (m.stock_qty >= b.qty_required) as available,
        (m.stock_qty - b.qty_required) as remaining_stock
      FROM orders o
      JOIN bom b ON o.bom_id = b.bom_id
      JOIN materials m ON b.material_id = m.material_id
      WHERE o.order_id = $1
    `;
    
    const result = await pool.query(query, [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'BOM not found for this order' });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching BOM:', error);
    res.status(500).json({ error: 'Failed to fetch BOM' });
  }
});

// GET /materials - Get all materials with stock levels
app.get('/api/materials', async (req, res) => {
  try {
    const query = 'SELECT * FROM materials ORDER BY material_name';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// PUT /materials/:id - Update material stock quantity
app.put('/api/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_qty } = req.body;
    
    if (stock_qty === undefined || stock_qty < 0) {
      return res.status(400).json({ error: 'Invalid stock quantity' });
    }
    
    const query = `
      UPDATE materials 
      SET stock_qty = $1, updated_at = CURRENT_TIMESTAMP
      WHERE material_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [stock_qty, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});