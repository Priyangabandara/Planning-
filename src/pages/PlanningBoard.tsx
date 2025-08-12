import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { format, addDays, differenceInDays, parseISO } from 'date-fns'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface Order {
  order_id: number
  order_name: string
  start_date: string
  end_date: string
  bom_id: number
  status: string
  hasShortage: boolean
  bom_items: Array<{
    material_id: number
    material_name: string
    qty_required: number
    stock_qty: number
    available: boolean
  }>
}

interface TimelineSlot {
  id: string
  date: string
  orders: Order[]
}

const PlanningBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [timelineSlots, setTimelineSlots] = useState<TimelineSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Generate timeline slots for the next 30 days
  const generateTimelineSlots = (): TimelineSlot[] => {
    const slots: TimelineSlot[] = []
    const startDate = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i)
      slots.push({
        id: `slot-${i}`,
        date: format(date, 'yyyy-MM-dd'),
        orders: []
      })
    }
    
    return slots
  }

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
      
      // Distribute orders across timeline slots
      const slots = generateTimelineSlots()
      data.forEach((order: Order) => {
        const startDate = parseISO(order.start_date)
        const daysFromStart = differenceInDays(startDate, new Date())
        if (daysFromStart >= 0 && daysFromStart < 30) {
          slots[daysFromStart].orders.push(order)
        }
      })
      setTimelineSlots(slots)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Update order dates
  const updateOrderDates = async (orderId: number, startDate: string, endDate: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/updateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, startDate, endDate }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order')
      }
      
      // Refresh orders after update
      await fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { destination, draggableId } = result
    const orderId = parseInt(draggableId)
    const order = orders.find(o => o.order_id === orderId)
    
    if (!order) return

    // Calculate new dates based on destination
    const destinationSlotIndex = parseInt(destination.droppableId.replace('slot-', ''))
    const newStartDate = format(addDays(new Date(), destinationSlotIndex), 'yyyy-MM-dd')
    const orderDuration = differenceInDays(parseISO(order.end_date), parseISO(order.start_date))
    const newEndDate = format(addDays(new Date(), destinationSlotIndex + orderDuration), 'yyyy-MM-dd')

    // Update order dates
    updateOrderDates(orderId, newStartDate, newEndDate)
  }



  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 text-lg">{error}</div>
        <button 
          onClick={fetchOrders}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning Board</h1>
          <p className="text-gray-600">Drag and drop orders to reschedule. BOM availability is checked automatically.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600">Shortage</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-max">
            {/* Timeline Header */}
            <div className="grid grid-cols-30 gap-1 p-4 border-b border-gray-200 bg-gray-50">
              {timelineSlots.map((slot) => (
                <div key={slot.id} className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {format(parseISO(slot.date), 'MMM dd')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(parseISO(slot.date), 'EEE')}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Slots */}
            <div className="grid grid-cols-30 gap-1 p-4">
              {timelineSlots.map((slot) => (
                <Droppable key={slot.id} droppableId={slot.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[120px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {slot.orders.map((order, index) => (
                        <Draggable
                          key={order.order_id}
                          draggableId={order.order_id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 p-3 rounded-lg border cursor-move transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-lg transform rotate-2'
                                  : 'shadow-sm'
                              } ${
                                order.hasShortage
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-green-50 border-green-200'
                              }`}
                              onClick={() => setSelectedOrder(order)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {order.order_name}
                                </h4>
                                {order.hasShortage ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {format(parseISO(order.start_date), 'MMM dd')} - {format(parseISO(order.end_date), 'MMM dd')}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedOrder.order_name}</h4>
                  <p className="text-sm text-gray-600">
                    {format(parseISO(selectedOrder.start_date), 'MMM dd, yyyy')} - {format(parseISO(selectedOrder.end_date), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">BOM Items</h5>
                  <div className="space-y-2">
                    {selectedOrder.bom_items?.map((item) => (
                      <div
                        key={item.material_id}
                        className={`flex items-center justify-between p-2 rounded ${
                          item.available ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.material_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Required: {item.qty_required} | Stock: {item.stock_qty}
                          </p>
                        </div>
                        {item.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanningBoard