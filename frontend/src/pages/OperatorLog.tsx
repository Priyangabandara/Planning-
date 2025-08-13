import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import { getSocket } from '../realtime'

interface LogEntry {
  id: number
  order_id: number
  workstation_id?: number
  qty_good: number
  qty_reject: number
  downtime_minutes?: number
  reason?: string
  timestamp: string
}

const OperatorLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [form, setForm] = useState<any>({ order_id: '', workstation_id: '', qty_good: 0, qty_reject: 0, downtime_minutes: 0, reason: '', timestamp: new Date().toISOString() })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs/production?limit=50`)
      const data = await res.json()
      setLogs(data)
    } catch (e) {
      setError('Failed to load logs')
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const payload = {
        order_id: Number(form.order_id),
        workstation_id: form.workstation_id ? Number(form.workstation_id) : undefined,
        qty_good: Number(form.qty_good),
        qty_reject: Number(form.qty_reject),
        downtime_minutes: Number(form.downtime_minutes) || 0,
        reason: form.reason || undefined,
        timestamp: form.timestamp,
      }
      const res = await fetch(`${API_BASE_URL}/logs/production`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Submit failed')
      setForm({ order_id: '', workstation_id: '', qty_good: 0, qty_reject: 0, downtime_minutes: 0, reason: '', timestamp: new Date().toISOString() })
    } catch (e) {
      setError('Failed to submit log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const socket = getSocket()
    const onNew = (log: LogEntry) => setLogs(prev => [log, ...prev].slice(0, 50))
    socket.on('logs:new', onNew)
    return () => { socket.off('logs:new', onNew) }
  }, [])

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Operator Production Log</h1>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input-field" required placeholder="Order ID" value={form.order_id} onChange={(e)=>setForm({...form, order_id: e.target.value})} />
          <input className="input-field" placeholder="Workstation ID" value={form.workstation_id} onChange={(e)=>setForm({...form, workstation_id: e.target.value})} />
          <input className="input-field" required type="number" min="0" placeholder="Qty Good" value={form.qty_good} onChange={(e)=>setForm({...form, qty_good: e.target.value})} />
          <input className="input-field" required type="number" min="0" placeholder="Qty Reject" value={form.qty_reject} onChange={(e)=>setForm({...form, qty_reject: e.target.value})} />
          <input className="input-field" type="number" min="0" placeholder="Downtime (min)" value={form.downtime_minutes} onChange={(e)=>setForm({...form, downtime_minutes: e.target.value})} />
          <input className="input-field" placeholder="Reason (optional)" value={form.reason} onChange={(e)=>setForm({...form, reason: e.target.value})} />
          <input className="input-field" type="datetime-local" value={new Date(form.timestamp).toISOString().slice(0,16)} onChange={(e)=>setForm({...form, timestamp: new Date(e.target.value).toISOString()})} />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Log'}</button>
            {error && <span className="text-red-600 self-center">{error}</span>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
        <div className="space-y-2">
          {logs.map((l)=> (
            <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-white/70">
              <div className="text-sm text-gray-700">Order #{l.order_id} • WS {l.workstation_id ?? '-'} • Good {l.qty_good} • Reject {l.qty_reject}</div>
              <div className="text-xs text-gray-500">{new Date(l.timestamp).toLocaleString()}</div>
            </div>
          ))}
          {logs.length === 0 && <div className="text-sm text-gray-500">No logs yet</div>}
        </div>
      </div>
    </div>
  )
}

export default OperatorLog