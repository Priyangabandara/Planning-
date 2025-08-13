import express from 'express';
import cors from 'cors';
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

// Mock data for development
const mockOrders = [
  {
    order_id: 1,
    order_name: "Production Order #001",
    start_date: "2024-01-15",
    end_date: "2024-01-20",
    bom_id: 1,
    status: "in_progress",
    hasShortage: false,
    bom_items: [
      {
        material_id: 1,
        material_name: "Steel Plate",
        qty_required: 10,
        stock_qty: 15,
        available: true
      },
      {
        material_id: 2,
        material_name: "Aluminum Sheet",
        qty_required: 5,
        stock_qty: 8,
        available: true
      }
    ]
  },
  {
    order_id: 2,
    order_name: "Production Order #002",
    start_date: "2024-01-22",
    end_date: "2024-01-25",
    bom_id: 2,
    status: "planned",
    hasShortage: true,
    bom_items: [
      {
        material_id: 3,
        material_name: "Copper Wire",
        qty_required: 20,
        stock_qty: 15,
        available: false
      }
    ]
  }
];

const mockMaterials = [
  {
    material_id: 1,
    material_name: "Steel Plate",
    stock_qty: 15,
    unit: "pieces",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    material_id: 2,
    material_name: "Aluminum Sheet",
    stock_qty: 8,
    unit: "pieces",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    material_id: 3,
    material_name: "Copper Wire",
    stock_qty: 15,
    unit: "meters",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// API Routes

// GET /orders - Fetch orders with BOM info
app.get('/api/orders', async (req, res) => {
  try {
    res.json(mockOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /materials - Fetch materials
app.get('/api/materials', async (req, res) => {
  try {
    res.json(mockMaterials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// PUT /materials/:id - Update material stock quantity
app.put('/api/materials/:id', async (req, res) => {
  try {
    const materialId = parseInt(req.params.id, 10);
    const { stock_qty } = req.body;

    if (Number.isNaN(materialId)) {
      return res.status(400).json({ error: 'Invalid material id' });
    }
    if (typeof stock_qty !== 'number' || stock_qty < 0) {
      return res.status(400).json({ error: 'Invalid stock quantity' });
    }

    const materialIndex = mockMaterials.findIndex((m) => m.material_id === materialId);
    if (materialIndex === -1) {
      return res.status(404).json({ error: 'Material not found' });
    }

    mockMaterials[materialIndex].stock_qty = stock_qty;
    mockMaterials[materialIndex].updated_at = new Date().toISOString();

    return res.json({ success: true, material: mockMaterials[materialIndex] });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// POST /updateOrder - Save new start/end dates
app.post('/api/updateOrder', async (req, res) => {
  try {
    const { orderId, startDate, endDate } = req.body;
    
    if (!orderId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find and update the order
    const orderIndex = mockOrders.findIndex(order => order.order_id === parseInt(orderId));
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    mockOrders[orderIndex].start_date = startDate;
    mockOrders[orderIndex].end_date = endDate;
    
    res.json({ success: true, order: mockOrders[orderIndex] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});