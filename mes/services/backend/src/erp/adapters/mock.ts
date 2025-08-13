import { ErpAdapter, OrderDetails, BomItem, OperationSmv } from '../interface.js';

export class MockErpAdapter implements ErpAdapter {
  async get_order_details(orderId: string): Promise<OrderDetails> {
    return {
      orderId,
      sku: 'SKU-123',
      description: 'Demo Product',
      plannedQuantity: 1000,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
    };
  }

  async get_bom(orderId: string): Promise<BomItem[]> {
    return [
      { materialId: 'MAT-1', description: 'Fabric', quantity: 2, unit: 'm' },
      { materialId: 'MAT-2', description: 'Thread', quantity: 0.05, unit: 'kg' }
    ];
  }

  async get_material_availability(orderId: string): Promise<{ materialId: string; availableQty: number; }[]> {
    return [
      { materialId: 'MAT-1', availableQty: 500 },
      { materialId: 'MAT-2', availableQty: 100 }
    ];
  }

  async get_operation_smv(orderId: string, operationId: string): Promise<OperationSmv> {
    return { operationId, smvMinutes: 0.75 };
  }
}

export default new MockErpAdapter();