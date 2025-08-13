import type { ErpAdapter, ErpAdapterName } from './interface.js';
import mock from './adapters/mock.js';

export function getErpAdapter(name: ErpAdapterName): ErpAdapter {
  switch (name) {
    case 'mock':
      return mock;
    // Stubs for future implementations
    case 'sap':
    case 'dynamics':
    case 'odoo':
      return mock;
    default:
      return mock;
  }
}