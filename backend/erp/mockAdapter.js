export default {
  async get_order_details(order_id) {
    return {
      order_id,
      order_name: `MOCK-ORDER-${order_id}`,
      operations: [
        { operation_id: 1, name: 'Cutting', smv: 3.5 },
        { operation_id: 2, name: 'Assembly', smv: 5.2 },
      ],
    }
  },
  async get_bom(order_id) {
    return [
      { material_id: 1, material_name: 'Steel Plate', qty_required: 10 },
      { material_id: 2, material_name: 'Aluminum Sheet', qty_required: 5 },
    ]
  },
  async get_material_availability(order_id) {
    return {
      order_id,
      items: [
        { material_id: 1, available_qty: 100, required_qty: 10 },
        { material_id: 2, available_qty: 20, required_qty: 5 },
      ],
    }
  },
  async get_operation_smv(order_id, operation_id) {
    const map = { 1: 3.5, 2: 5.2 }
    return map[operation_id] ?? 4.0
  },
}