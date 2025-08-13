import { Router } from 'express';
import { getErpAdapter } from '../erp/loader.js';
import { config } from '../config.js';
import axios from 'axios';
import { storage } from '../storage.js';

const router = Router();
const erp = getErpAdapter(config.erpAdapter as any);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

router.get('/orders/:orderId', async (req, res) => {
  const details = await erp.get_order_details(req.params.orderId);
  res.json(details);
});

router.get('/orders/:orderId/bom', async (req, res) => {
  const bom = await erp.get_bom(req.params.orderId);
  res.json(bom);
});

router.get('/orders/:orderId/materials', async (req, res) => {
  const materials = await erp.get_material_availability(req.params.orderId);
  res.json(materials);
});

router.get('/orders/:orderId/operations/:operationId/smv', async (req, res) => {
  const smv = await erp.get_operation_smv(req.params.orderId, req.params.operationId);
  res.json(smv);
});

router.get('/realtime/metrics', async (_req, res) => {
  // Example: call analytics service for a sample computation, with fallback if unavailable
  try {
    const target = await axios
      .post(`${config.analyticsUrl}/compute/targets`, { smv: 0.75, qty: 1000 })
      .then(r => r.data);
    return res.json({
      kpi: {
        targetUnits: target.targetUnits,
        actualUnits: 420,
        efficiency: 420 / Math.max(target.targetUnits, 1),
      },
    });
  } catch (err) {
    const targetUnits = 1000;
    return res.json({
      kpi: {
        targetUnits,
        actualUnits: 420,
        efficiency: 420 / Math.max(targetUnits, 1),
      },
      warning: 'Analytics service unavailable; using fallback',
    });
  }
});

// Production Logs
router.get('/production/logs', async (_req, res) => {
  const rows = await storage.listProductionLogs();
  res.json(rows);
});
router.post('/production/logs', async (req, res) => {
  const { orderId, workstationId, producedQty, rejectedQty } = req.body || {};
  if (!orderId || typeof producedQty !== 'number') return res.status(400).json({ error: 'orderId and producedQty required' });
  await storage.addProductionLog({ orderId, workstationId, producedQty, rejectedQty });
  res.status(201).json({ ok: true });
});

// Planned Production
router.get('/production/planned', async (_req, res) => {
  const rows = await storage.listPlanned();
  res.json(rows);
});
router.post('/production/planned', async (req, res) => {
  const { orderId, plannedQty, startTime, endTime } = req.body || {};
  if (!orderId || typeof plannedQty !== 'number') return res.status(400).json({ error: 'orderId and plannedQty required' });
  await storage.addPlanned({ orderId, plannedQty, startTime, endTime });
  res.status(201).json({ ok: true });
});

// Alerts
router.get('/alerts', async (_req, res) => {
  const rows = await storage.listAlerts();
  res.json(rows);
});
router.post('/alerts', async (req, res) => {
  const { level, message } = req.body || {};
  if (!level || !message) return res.status(400).json({ error: 'level and message required' });
  await storage.addAlert({ level, message });
  res.status(201).json({ ok: true });
});

// Downtime
router.get('/downtime', async (_req, res) => {
  const rows = await storage.listDowntime();
  res.json(rows);
});
router.post('/downtime', async (req, res) => {
  const { workstationId, reason, startTime, endTime } = req.body || {};
  if (!workstationId || !reason || !startTime) return res.status(400).json({ error: 'workstationId, reason, startTime required' });
  await storage.addDowntime({ workstationId, reason, startTime, endTime });
  res.status(201).json({ ok: true });
});

export default router;