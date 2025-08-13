import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';

export function AlertsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ level: 'warning', message: '' });

  async function refresh() {
    const data = await apiGet<any[]>('/api/alerts');
    setItems(data);
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiPost('/api/alerts', form);
    setForm({ level: 'warning', message: '' });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Raise Alert</div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select className="input" value={form.level} onChange={e=>setForm({...form, level: e.target.value})}>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <input className="input md:col-span-2" placeholder="Message" value={form.message} onChange={e=>setForm({...form, message: e.target.value})} />
          <button className="btn-primary" type="submit">Create</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="font-semibold mb-3">Recent Alerts</div>
        <ul className="space-y-2">
          {items.map((a, idx) => (
            <li key={idx} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between">
              <div>
                <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${badgeColor(a.level)}`}>{a.level}</span>
                <span className="ml-3">{a.message}</span>
              </div>
              <div className="text-xs text-slate-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function badgeColor(level: string) {
  switch(level) {
    case 'critical': return 'bg-rose-100 text-rose-700';
    case 'warning': return 'bg-amber-100 text-amber-700';
    default: return 'bg-sky-100 text-sky-700';
  }
}