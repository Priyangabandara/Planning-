import { Pool } from 'pg';
import { config } from './config.js';

export type ProductionLog = { id?: number; orderId: string; workstationId?: string; producedQty: number; rejectedQty?: number; timestamp?: string };
export type PlannedItem = { id?: number; orderId: string; plannedQty: number; startTime?: string; endTime?: string };
export type AlertItem = { id?: number; level: string; message: string; createdAt?: string; acknowledged?: boolean };
export type DowntimeLog = { id?: number; workstationId: string; reason: string; startTime: string; endTime?: string };

class InMemoryStore {
  productionLogs: ProductionLog[] = [];
  planned: PlannedItem[] = [];
  alerts: AlertItem[] = [];
  downtime: DowntimeLog[] = [];

  async addProductionLog(log: ProductionLog) { this.productionLogs.push({ ...log, id: this.productionLogs.length + 1, timestamp: new Date().toISOString() }); }
  async listProductionLogs() { return this.productionLogs.slice(-500).reverse(); }

  async addPlanned(item: PlannedItem) { this.planned.push({ ...item, id: this.planned.length + 1 }); }
  async listPlanned() { return this.planned.slice(-500).reverse(); }

  async addAlert(item: AlertItem) { this.alerts.push({ ...item, id: this.alerts.length + 1, createdAt: new Date().toISOString(), acknowledged: false }); }
  async listAlerts() { return this.alerts.slice(-500).reverse(); }

  async addDowntime(item: DowntimeLog) { this.downtime.push({ ...item, id: this.downtime.length + 1 }); }
  async listDowntime() { return this.downtime.slice(-500).reverse(); }
}

export class Storage {
  private pool: Pool | null = null;
  private memory = new InMemoryStore();
  private ready = false;

  async init() {
    try {
      this.pool = new Pool({ connectionString: config.databaseUrl });
      await this.pool.query('select 1');
      this.ready = true;
    } catch (err) {
      this.pool = null;
      this.ready = false;
    }
  }

  async addProductionLog(log: ProductionLog) {
    if (!this.ready || !this.pool) return this.memory.addProductionLog(log);
    await this.pool.query(
      'INSERT INTO ProductionLogs(order_id, workstation_id, produced_qty, rejected_qty) VALUES ($1,$2,$3,$4)',
      [log.orderId, log.workstationId || null, log.producedQty, log.rejectedQty || 0]
    );
  }
  async listProductionLogs(): Promise<ProductionLog[]> {
    if (!this.ready || !this.pool) return this.memory.listProductionLogs();
    const { rows } = await this.pool.query('SELECT id, order_id as "orderId", workstation_id as "workstationId", produced_qty as "producedQty", rejected_qty as "rejectedQty", timestamp FROM ProductionLogs ORDER BY id DESC LIMIT 500');
    return rows;
  }

  async addPlanned(item: PlannedItem) {
    if (!this.ready || !this.pool) return this.memory.addPlanned(item);
    await this.pool.query(
      'INSERT INTO PlannedProduction(order_id, planned_qty, start_time, end_time) VALUES ($1,$2,$3,$4)',
      [item.orderId, item.plannedQty, item.startTime || null, item.endTime || null]
    );
  }
  async listPlanned(): Promise<PlannedItem[]> {
    if (!this.ready || !this.pool) return this.memory.listPlanned();
    const { rows } = await this.pool.query('SELECT id, order_id as "orderId", planned_qty as "plannedQty", start_time as "startTime", end_time as "endTime" FROM PlannedProduction ORDER BY id DESC LIMIT 500');
    return rows;
  }

  async addAlert(item: AlertItem) {
    if (!this.ready || !this.pool) return this.memory.addAlert(item);
    await this.pool.query('INSERT INTO Alerts(level, message) VALUES ($1,$2)', [item.level, item.message]);
  }
  async listAlerts(): Promise<AlertItem[]> {
    if (!this.ready || !this.pool) return this.memory.listAlerts();
    const { rows } = await this.pool.query('SELECT id, level, message, created_at as "createdAt", acknowledged FROM Alerts ORDER BY id DESC LIMIT 200');
    return rows;
  }

  async addDowntime(item: DowntimeLog) {
    if (!this.ready || !this.pool) return this.memory.addDowntime(item);
    await this.pool.query('INSERT INTO DowntimeLogs(workstation_id, reason, start_time, end_time) VALUES ($1,$2,$3,$4)', [item.workstationId, item.reason, item.startTime, item.endTime || null]);
  }
  async listDowntime(): Promise<DowntimeLog[]> {
    if (!this.ready || !this.pool) return this.memory.listDowntime();
    const { rows } = await this.pool.query('SELECT id, workstation_id as "workstationId", reason, start_time as "startTime", end_time as "endTime" FROM DowntimeLogs ORDER BY id DESC LIMIT 200');
    return rows;
  }
}

export const storage = new Storage();