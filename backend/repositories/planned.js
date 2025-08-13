import { getDbPool } from '../db/pool.js'

const fallbackPlanned = []

export async function listPlanned(limit = 200) {
  const pool = getDbPool()
  if (!pool) return fallbackPlanned.slice(-limit)
  const { rows } = await pool.query(
    `SELECT id, order_id, planned_date, quantity, workstation_id, status, created_at, updated_at
     FROM planned_production ORDER BY planned_date ASC LIMIT $1`, [limit]
  )
  return rows
}

export async function createPlanned(entry) {
  const pool = getDbPool()
  if (!pool) {
    const item = { id: fallbackPlanned.length + 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...entry }
    fallbackPlanned.push(item)
    return item
  }
  const { rows } = await pool.query(
    `INSERT INTO planned_production (order_id, planned_date, quantity, workstation_id, status)
     VALUES ($1,$2,$3,$4,COALESCE($5,'planned')) RETURNING *`,
    [entry.order_id, entry.planned_date, entry.quantity, entry.workstation_id ?? null, entry.status]
  )
  return rows[0]
}

export async function updatePlanned(id, updates) {
  const pool = getDbPool()
  if (!pool) {
    const idx = fallbackPlanned.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Not found')
    fallbackPlanned[idx] = { ...fallbackPlanned[idx], ...updates, updated_at: new Date().toISOString() }
    return fallbackPlanned[idx]
  }
  const { rows } = await pool.query(
    `UPDATE planned_production SET
       order_id = COALESCE($2, order_id),
       planned_date = COALESCE($3, planned_date),
       quantity = COALESCE($4, quantity),
       workstation_id = COALESCE($5, workstation_id),
       status = COALESCE($6, status)
     WHERE id = $1 RETURNING *`,
    [id, updates.order_id ?? null, updates.planned_date ?? null, updates.quantity ?? null, updates.workstation_id ?? null, updates.status ?? null]
  )
  if (rows.length === 0) throw new Error('Not found')
  return rows[0]
}

export async function deletePlanned(id) {
  const pool = getDbPool()
  if (!pool) {
    const idx = fallbackPlanned.findIndex(p => p.id === id)
    if (idx === -1) return { deleted: false }
    fallbackPlanned.splice(idx, 1)
    return { deleted: true }
  }
  const { rowCount } = await pool.query('DELETE FROM planned_production WHERE id = $1', [id])
  return { deleted: rowCount > 0 }
}