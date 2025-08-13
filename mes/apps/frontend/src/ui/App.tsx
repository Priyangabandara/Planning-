import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { DashboardPage } from './pages/Dashboard';
import { ProductionLogsPage } from './pages/ProductionLogs';
import { PlannedProductionPage } from './pages/PlannedProduction';
import { AlertsPage } from './pages/Alerts';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/production-logs" element={<ProductionLogsPage />} />
        <Route path="/planned-production" element={<PlannedProductionPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </Layout>
  );
}