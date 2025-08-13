import { getDbPool } from '../db/pool.js'

export async function getAllOrders(mockOrders) {
  const pool = getDbPool()
  if (!pool) return mockOrders
  const { rows } = await pool.query(
    `SELECT o.order_id, o.order_name, o.start_date, o.end_date, o.bom_id, o.status,
            COALESCE(json_agg(json_build_object(
              'material_id', b.material_id,
              'material_name', m.material_name,
              'qty_required', b.qty_required,
              'stock_qty', m.stock_qty,
              'available', (m.stock_qty >= b.qty_required)
            )) FILTER (WHERE b.bom_id IS NOT NULL), '[]') AS bom_items
     FROM orders o
     LEFT JOIN bom b ON b.bom_id = o.bom_id
     LEFT JOIN materials m ON m.material_id = b.material_id
     GROUP BY o.order_id
     ORDER BY o.start_date ASC`
  )
  return rows.map(r => ({
    ...r,
    hasShortage: Array.isArray(r.bom_items) ? r.bom_items.some(i => !i.available) : false,
  }))
}

export async function updateOrderDates(orderId, startDate, endDate, mockOrders) {
  const pool = getDbPool()
  if (!pool) {
    const idx = mockOrders.findIndex(o => o.order_id === orderId)
    if (idx === -1) throw new Error('Order not found')
    mockOrders[idx].start_date = startDate
    mockOrders[idx].end_date = endDate
    return mockOrders[idx]
  }
  const { rows } = await pool.query(
    'UPDATE orders SET start_date = $1, end_date = $2 WHERE order_id = $3 RETURNING *',
    [startDate, endDate, orderId]
  )
  if (rows.length === 0) throw new Error('Order not found')
  return rows[0]
}