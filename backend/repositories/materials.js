import { getDbPool } from '../db/pool.js'

export async function getAllMaterials(mockMaterials) {
  const pool = getDbPool()
  if (!pool) return mockMaterials
  const { rows } = await pool.query('SELECT material_id, material_name, stock_qty, created_at, updated_at FROM materials ORDER BY material_name ASC')
  return rows
}

export async function updateMaterialStock(materialId, stockQty, mockMaterials) {
  const pool = getDbPool()
  if (!pool) {
    const idx = mockMaterials.findIndex(m => m.material_id === materialId)
    if (idx !== -1) {
      mockMaterials[idx].stock_qty = stockQty
      mockMaterials[idx].updated_at = new Date().toISOString()
      return mockMaterials[idx]
    }
    throw new Error('Material not found')
  }
  const { rows } = await pool.query(
    'UPDATE materials SET stock_qty = $1 WHERE material_id = $2 RETURNING material_id, material_name, stock_qty, created_at, updated_at',
    [stockQty, materialId]
  )
  if (rows.length === 0) throw new Error('Material not found')
  return rows[0]
}