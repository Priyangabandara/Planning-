-- Supabase Database Schema for Planning Tool
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    material_id BIGSERIAL PRIMARY KEY,
    material_name VARCHAR(255) NOT NULL UNIQUE,
    stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOM (Bill of Materials) table
CREATE TABLE IF NOT EXISTS bom (
    bom_id BIGSERIAL PRIMARY KEY,
    material_id BIGINT REFERENCES materials(material_id) ON DELETE CASCADE,
    qty_required INTEGER NOT NULL CHECK (qty_required > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id BIGSERIAL PRIMARY KEY,
    order_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= start_date),
    bom_id BIGINT REFERENCES bom(bom_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'shortage')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_dates ON orders(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bom_material ON bom(material_id);
CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(material_name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Materials policies (allow all operations for now - adjust based on your auth needs)
CREATE POLICY "Allow all operations on materials" ON materials
    FOR ALL USING (true) WITH CHECK (true);

-- BOM policies
CREATE POLICY "Allow all operations on bom" ON bom
    FOR ALL USING (true) WITH CHECK (true);

-- Orders policies
CREATE POLICY "Allow all operations on orders" ON orders
    FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO materials (material_name, stock_qty) VALUES
('Steel Plate', 1000),
('Aluminum Sheet', 500),
('Copper Wire', 200),
('Plastic Housing', 300),
('Electronic Components', 150),
('Rubber Gaskets', 400)
ON CONFLICT (material_name) DO NOTHING;

-- Insert BOM items
INSERT INTO bom (material_id, qty_required) VALUES
((SELECT material_id FROM materials WHERE material_name = 'Steel Plate'), 50),
((SELECT material_id FROM materials WHERE material_name = 'Aluminum Sheet'), 25),
((SELECT material_id FROM materials WHERE material_name = 'Copper Wire'), 10),
((SELECT material_id FROM materials WHERE material_name = 'Plastic Housing'), 15),
((SELECT material_id FROM materials WHERE material_name = 'Electronic Components'), 8),
((SELECT material_id FROM materials WHERE material_name = 'Rubber Gaskets'), 20)
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO orders (order_name, start_date, end_date, bom_id) VALUES
('Order A-001', '2024-01-15', '2024-01-20', (SELECT bom_id FROM bom WHERE material_id = (SELECT material_id FROM materials WHERE material_name = 'Steel Plate') LIMIT 1)),
('Order B-002', '2024-01-18', '2024-01-25', (SELECT bom_id FROM bom WHERE material_id = (SELECT material_id FROM materials WHERE material_name = 'Plastic Housing') LIMIT 1)),
('Order C-003', '2024-01-22', '2024-01-28', (SELECT bom_id FROM bom WHERE material_id = (SELECT material_id FROM materials WHERE material_name = 'Steel Plate') LIMIT 1)),
('Order D-004', '2024-01-25', '2024-02-01', (SELECT bom_id FROM bom WHERE material_id = (SELECT material_id FROM materials WHERE material_name = 'Plastic Housing') LIMIT 1)),
('Order E-005', '2024-01-28', '2024-02-05', (SELECT bom_id FROM bom WHERE material_id = (SELECT material_id FROM materials WHERE material_name = 'Steel Plate') LIMIT 1))
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Workstations / Lines
CREATE TABLE IF NOT EXISTS workstations (
  workstation_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  line TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Logs (Actual)
CREATE TABLE IF NOT EXISTS production_logs (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  workstation_id BIGINT REFERENCES workstations(workstation_id) ON DELETE SET NULL,
  qty_good INTEGER NOT NULL DEFAULT 0 CHECK (qty_good >= 0),
  qty_reject INTEGER NOT NULL DEFAULT 0 CHECK (qty_reject >= 0),
  downtime_minutes INTEGER DEFAULT 0 CHECK (downtime_minutes >= 0),
  reason TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planned Production
CREATE TABLE IF NOT EXISTS planned_production (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  planned_date DATE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  workstation_id BIGINT REFERENCES workstations(workstation_id) ON DELETE SET NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_planned_updated_at BEFORE UPDATE ON planned_production
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Targets
CREATE TABLE IF NOT EXISTS targets (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
  workstation_id BIGINT REFERENCES workstations(workstation_id) ON DELETE SET NULL,
  target_units INTEGER CHECK (target_units >= 0),
  calc_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ERP Connections (metadata)
CREATE TABLE IF NOT EXISTS erp_connections (
  id BIGSERIAL PRIMARY KEY,
  adapter TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (simple placeholder)
CREATE TABLE IF NOT EXISTS app_users (
  user_id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin','planner','operator','viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enable and permissive policies (adjust later)
ALTER TABLE workstations ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on workstations" ON workstations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on production_logs" ON production_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on planned_production" ON planned_production FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on targets" ON targets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on erp_connections" ON erp_connections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on app_users" ON app_users FOR ALL USING (true) WITH CHECK (true);