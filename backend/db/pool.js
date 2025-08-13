import { Pool } from 'pg'

let pool = null

export function getDbPool() {
  if (pool !== null) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null
  pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  return pool
}