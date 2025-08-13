import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const PlanningBoard = React.lazy(() => import('./pages/PlanningBoard'))
const Materials = React.lazy(() => import('./pages/Materials'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const OperatorLog = React.lazy(() => import('./pages/OperatorLog'))

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planning" element={<PlanningBoard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/operator" element={<OperatorLog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App