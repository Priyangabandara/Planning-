import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getErpAdapter } from './erp/index.js';
import { getAllMaterials, updateMaterialStock } from './repositories/materials.js'
import { getAllOrders, updateOrderDates } from './repositories/orders.js'
import { createProductionLog, listProductionLogs } from './repositories/logs.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ERP Adapter
const erp = getErpAdapter();

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

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.emit('server:hello', { message: 'Welcome to Planning Tool Realtime' });
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

function emitMaterialsUpdate() {
  io.emit('materials:update', mockMaterials);
}

function emitOrdersUpdate() {
  io.emit('orders:update', mockOrders);
}

// API Routes

// GET /orders - Fetch orders with BOM info
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getAllOrders(mockOrders)
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /materials - Fetch materials
app.get('/api/materials', async (req, res) => {
  try {
    const materials = await getAllMaterials(mockMaterials)
    res.json(materials);
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

    const updated = await updateMaterialStock(materialId, stock_qty, mockMaterials)
    emitMaterialsUpdate();
    return res.json({ success: true, material: updated });
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
    
    const updated = await updateOrderDates(parseInt(orderId,10), startDate, endDate, mockOrders)
    emitOrdersUpdate();
    res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Production Logs
app.post('/api/logs/production', async (req, res) => {
  try {
    const payload = req.body
    const required = ['order_id','workstation_id','qty_good','qty_reject','timestamp']
    for (const key of required) if (payload[key] === undefined) return res.status(400).json({ error: `Missing ${key}` })
    const log = await createProductionLog(payload)
    io.emit('logs:new', log)
    res.json({ success: true, log })
  } catch (error) {
    console.error('Error creating production log:', error)
    res.status(500).json({ error: 'Failed to create production log' })
  }
})

app.get('/api/logs/production', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100
    const logs = await listProductionLogs(limit)
    res.json(logs)
  } catch (error) {
    console.error('Error fetching production logs:', error)
    res.status(500).json({ error: 'Failed to fetch production logs' })
  }
})

// KPIs overview
app.get('/api/kpis/overview', async (req, res) => {
  try {
    // Simple mock KPI calc: totals from logs
    const logs = await listProductionLogs(1000)
    const totalGood = logs.reduce((s,l)=>s + (l.qty_good||0), 0)
    const totalReject = logs.reduce((s,l)=>s + (l.qty_reject||0), 0)
    const totalDowntime = logs.reduce((s,l)=>s + (l.downtime_minutes||0), 0)
    const oee = totalGood > 0 ? Math.max(50, Math.min(95, 100 - (totalReject/(totalGood+totalReject||1))*100 - (totalDowntime/ (logs.length*60 || 1))*10)) : 75
    res.json({ totalGood, totalReject, totalDowntime, oee: Math.round(oee) })
  } catch (error) {
    console.error('Error computing KPIs:', error)
    res.status(500).json({ error: 'Failed to compute KPIs' })
  }
})

// ERP Adapter passthrough (mock for now)
app.get('/api/erp/order/:orderId', async (req, res) => {
  try {
    const data = await erp.get_order_details(parseInt(req.params.orderId, 10));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'ERP adapter error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});