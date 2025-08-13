import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.BACKEND_PORT || '4000', 10),
  analyticsUrl: process.env.ANALYTICS_URL || 'http://localhost:5000',
  erpAdapter: process.env.ERP_ADAPTER || 'mock',
  corsOrigin: (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim()),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mes',
};