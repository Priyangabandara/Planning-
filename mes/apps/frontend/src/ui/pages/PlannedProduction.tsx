import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';

export function PlannedProductionPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ orderId: '', plannedQty: 0, startTime: '', endTime: '' });

  async function refresh() {
    const data = await apiGet<any[]>('/api/production/planned');
    setItems(data);
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiPost('/api/production/planned', { ...form, plannedQty: Number(form.plannedQty) });
    setForm({ orderId: '', plannedQty: 0, startTime: '', endTime: '' });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Add Planned Production</div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="input" placeholder="Order ID" value={form.orderId} onChange={e=>setForm({...form, orderId: e.target.value})} />
          <input className="input" placeholder="Planned Qty" type="number" value={form.plannedQty} onChange={e=>setForm({...form, plannedQty: Number(e.target.value)})} />
          <input className="input" placeholder="Start Time (ISO)" value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} />
          <input className="input" placeholder="End Time (ISO)" value={form.endTime} onChange={e=>setForm({...form, endTime: e.target.value})} />
          <button className="btn-primary" type="submit">Add</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Planned Items</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Order</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Start</th>
                <th className="py-2">End</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="py-2">{i.orderId}</td>
                  <td className="py-2">{i.plannedQty}</td>
                  <td className="py-2">{i.startTime ? new Date(i.startTime).toLocaleString() : '-'}</td>
                  <td className="py-2">{i.endTime ? new Date(i.endTime).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}