export interface BomItem {
  materialId: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface OperationSmv {
  operationId: string;
  smvMinutes: number;
}

export interface OrderDetails {
  orderId: string;
  sku: string;
  description: string;
  plannedQuantity: number;
  dueDate: string;
}

export interface ErpAdapter {
  get_order_details(orderId: string): Promise<OrderDetails>;
  get_bom(orderId: string): Promise<BomItem[]>;
  get_material_availability(orderId: string): Promise<{ materialId: string; availableQty: number; }[]>;
  get_operation_smv(orderId: string, operationId: string): Promise<OperationSmv>;
}

export type ErpAdapterName = 'mock' | 'sap' | 'dynamics' | 'odoo';