import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';

export function ProductionLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [form, setForm] = useState({ orderId: '', workstationId: '', producedQty: 0, rejectedQty: 0 });

  async function refresh() {
    const data = await apiGet<any[]>('/api/production/logs');
    setLogs(data);
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiPost('/api/production/logs', { ...form, producedQty: Number(form.producedQty), rejectedQty: Number(form.rejectedQty) });
    setForm({ orderId: '', workstationId: '', producedQty: 0, rejectedQty: 0 });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Add Production Log</div>
        <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input className="input" placeholder="Order ID" value={form.orderId} onChange={e=>setForm({...form, orderId: e.target.value})} />
          <input className="input" placeholder="Workstation" value={form.workstationId} onChange={e=>setForm({...form, workstationId: e.target.value})} />
          <input className="input" placeholder="Produced Qty" type="number" value={form.producedQty} onChange={e=>setForm({...form, producedQty: Number(e.target.value)})} />
          <input className="input" placeholder="Rejected Qty" type="number" value={form.rejectedQty} onChange={e=>setForm({...form, rejectedQty: Number(e.target.value)})} />
          <button className="btn-primary" type="submit">Add</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Recent Logs</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Time</th>
                <th className="py-2">Order</th>
                <th className="py-2">Workstation</th>
                <th className="py-2">Produced</th>
                <th className="py-2">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="py-2">{l.timestamp ? new Date(l.timestamp).toLocaleString() : '-'}</td>
                  <td className="py-2">{l.orderId}</td>
                  <td className="py-2">{l.workstationId || '-'}</td>
                  <td className="py-2">{l.producedQty}</td>
                  <td className="py-2">{l.rejectedQty ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Tailwind component utilities
declare module 'react' { interface HTMLAttributes<T> { } }
const styles = document.createElement('style');
styles.innerHTML = `
.input { @apply border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500; }
.btn-primary { @apply bg-slate-900 text-white rounded-lg px-4 py-2 hover:bg-slate-800; }
`;
document.head.appendChild(styles);