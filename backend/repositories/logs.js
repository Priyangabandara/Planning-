import { getDbPool } from '../db/pool.js'

const fallbackLogs = []

export async function createProductionLog(payload) {
  const pool = getDbPool()
  if (!pool) {
    const log = { id: fallbackLogs.length + 1, created_at: new Date().toISOString(), ...payload }
    fallbackLogs.push(log)
    return log
  }
  const {
    order_id,
    workstation_id,
    qty_good,
    qty_reject,
    downtime_minutes,
    reason,
    timestamp,
  } = payload
  const { rows } = await pool.query(
    `INSERT INTO production_logs (order_id, workstation_id, qty_good, qty_reject, downtime_minutes, reason, timestamp)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [order_id, workstation_id, qty_good, qty_reject, downtime_minutes, reason, timestamp]
  )
  return rows[0]
}

export async function listProductionLogs(limit = 100) {
  const pool = getDbPool()
  if (!pool) {
    return fallbackLogs.slice(-limit).reverse()
  }
  const { rows } = await pool.query(
    `SELECT * FROM production_logs ORDER BY timestamp DESC LIMIT $1`,
    [limit]
  )
  return rows
}