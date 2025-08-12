-- Database schema for Planning Tool

-- Materials table
CREATE TABLE materials (
    material_id SERIAL PRIMARY KEY,
    material_name VARCHAR(255) NOT NULL,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOM (Bill of Materials) table
CREATE TABLE bom (
    bom_id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(material_id),
    qty_required INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    bom_id INTEGER REFERENCES bom(bom_id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO materials (material_name, stock_qty) VALUES
('Steel Plate', 1000),
('Aluminum Sheet', 500),
('Copper Wire', 200),
('Plastic Housing', 300),
('Electronic Components', 150),
('Rubber Gaskets', 400);

INSERT INTO bom (material_id, qty_required) VALUES
(1, 50),  -- BOM 1: Steel Plate
(2, 25),  -- BOM 1: Aluminum Sheet
(3, 10),  -- BOM 1: Copper Wire
(4, 15),  -- BOM 2: Plastic Housing
(5, 8),   -- BOM 2: Electronic Components
(6, 20);  -- BOM 2: Rubber Gaskets

INSERT INTO orders (order_name, start_date, end_date, bom_id) VALUES
('Order A-001', '2024-01-15', '2024-01-20', 1),
('Order B-002', '2024-01-18', '2024-01-25', 2),
('Order C-003', '2024-01-22', '2024-01-28', 1),
('Order D-004', '2024-01-25', '2024-02-01', 2),
('Order E-005', '2024-01-28', '2024-02-05', 1);

-- Create indexes for better performance
CREATE INDEX idx_orders_dates ON orders(start_date, end_date);
CREATE INDEX idx_bom_material ON bom(material_id);
CREATE INDEX idx_materials_name ON materials(material_name);