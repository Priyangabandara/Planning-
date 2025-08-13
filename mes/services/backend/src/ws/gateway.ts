import { Server } from 'socket.io';
import axios from 'axios';
import { config } from '../config.js';

export function setupWebsocket(httpServer: any) {
  const io = new Server(httpServer, { cors: { origin: config.corsOrigin } });

  io.on('connection', (socket) => {
    socket.emit('connected', { ts: Date.now() });
  });

  // Broadcast KPI updates periodically
  setInterval(async () => {
    try {
      const target = await axios.post(`${config.analyticsUrl}/compute/targets`, { smv: 0.75, qty: 1000 }).then(r => r.data);
      const actualUnits = Math.floor(300 + Math.random() * 200);
      const efficiency = actualUnits / Math.max(target.targetUnits, 1);
      io.emit('kpi_update', { targetUnits: target.targetUnits, actualUnits, efficiency });
    } catch (err) {
      // swallow for demo
    }
  }, 5000);

  return io;
}