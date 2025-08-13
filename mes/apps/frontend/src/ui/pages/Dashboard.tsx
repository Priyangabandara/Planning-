import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../lib/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function DashboardPage() {
  const [points, setPoints] = useState<{ ts: number; actual: number; target: number }[]>([]);
  const latest = points[points.length - 1];

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket'] });
    socket.on('kpi_update', (payload: { targetUnits: number; actualUnits: number; efficiency: number }) => {
      setPoints((prev) => [...prev.slice(-59), { ts: Date.now(), actual: payload.actualUnits, target: payload.targetUnits }]);
    });
    return () => socket.disconnect();
  }, []);

  const data = useMemo(() => ({
    labels: points.map(p => new Date(p.ts).toLocaleTimeString()),
    datasets: [
      { label: 'Actual Units', data: points.map(p => p.actual), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.2)' },
      { label: 'Target Units', data: points.map(p => p.target), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)' },
    ],
  }), [points]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Actual Units" value={latest?.actual?.toFixed(0) ?? '-'} color="text-sky-600" />
        <KpiCard title="Target Units" value={latest?.target?.toFixed(0) ?? '-'} color="text-emerald-600" />
        <KpiCard title="Efficiency" value={latest ? `${((latest.actual / Math.max(latest.target, 1)) * 100).toFixed(1)}%` : '-'} color="text-violet-600" />
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
        <div className="text-sm font-semibold mb-2">Production Trend</div>
        <Line data={data} options={{ responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{title}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}