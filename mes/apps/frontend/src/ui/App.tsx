import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function App() {
  const [kpi, setKpi] = useState<{targetUnits: number; actualUnits: number; efficiency: number} | null>(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const socket: Socket = io(backendUrl, { transports: ['websocket'] });
    socket.on('connect', () => setStatus('connected'));
    socket.on('kpi_update', (payload) => setKpi(payload));
    socket.on('disconnect', () => setStatus('disconnected'));
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <h1>MES Dashboard</h1>
      <p>Status: {status}</p>
      {kpi ? (
        <div style={{ display: 'flex', gap: 24 }}>
          <Card title="Target Units" value={kpi.targetUnits.toFixed(0)} />
          <Card title="Actual Units" value={kpi.actualUnits.toFixed(0)} />
          <Card title="Efficiency" value={(kpi.efficiency * 100).toFixed(1) + '%'} />
        </div>
      ) : (
        <p>Waiting for KPI updates...</p>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 160 }}>
      <div style={{ color: '#666', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}