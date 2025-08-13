import mockAdapter from './mockAdapter.js'

const adapters = {
  mock: mockAdapter,
  // sap: await import('./sapAdapter.js'),
  // dynamics: await import('./dynamicsAdapter.js'),
  // odoo: await import('./odooAdapter.js'),
}

export function getErpAdapter() {
  const key = (process.env.ERP_ADAPTER || 'mock').toLowerCase()
  const adapter = adapters[key]
  if (!adapter) {
    return mockAdapter
  }
  return adapter
}