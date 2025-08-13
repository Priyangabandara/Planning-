import { Router } from 'express';
import { getErpAdapter } from '../erp/loader.js';
import { config } from '../config.js';
import axios from 'axios';

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

export default router;