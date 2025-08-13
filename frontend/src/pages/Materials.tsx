import React, { useState, useEffect } from 'react'
import { Package, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'

interface Material {
  material_id: number
  material_name: string
  stock_qty: number
  created_at: string
  updated_at: string
}

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMaterial, setEditingMaterial] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState<number>(0)

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/materials')
      if (!response.ok) {
        throw new Error('Failed to fetch materials')
      }
      const data = await response.json()
      setMaterials(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Update material stock quantity
  const updateMaterialStock = async (materialId: number, newQuantity: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock_qty: newQuantity }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update material')
      }
      
      // Refresh materials after update
      await fetchMaterials()
      setEditingMaterial(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update material')
    }
  }

  // Start editing a material
  const startEditing = (material: Material) => {
    setEditingMaterial(material.material_id)
    setEditQuantity(material.stock_qty)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingMaterial(null)
    setEditQuantity(0)
  }

  // Save changes
  const saveChanges = () => {
    if (editingMaterial) {
      updateMaterialStock(editingMaterial, editQuantity)
    }
  }

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return 'out-of-stock'
    if (quantity < 50) return 'low-stock'
    if (quantity < 100) return 'medium-stock'
    return 'good-stock'
  }

  // Get status icon and color
  const getStatusDisplay = (quantity: number) => {
    const status = getStockStatus(quantity)
    switch (status) {
      case 'out-of-stock':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
      case 'low-stock':
        return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' }
      case 'medium-stock':
        return { icon: TrendingDown, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' }
      case 'good-stock':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' }
      default:
        return { icon: Package, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' }
    }
  }

  useEffect(() => {
    fetchMaterials()
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
          onClick={fetchMaterials}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-sunset font-display">Materials Inventory</h1>
            <p className="text-gray-600 text-lg">Monitor stock levels and update quantities as needed.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Good Stock</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Low Stock</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Out of Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => {
          const statusDisplay = getStatusDisplay(material.stock_qty)
          const StatusIcon = statusDisplay.icon
          const isEditing = editingMaterial === material.material_id

          return (
            <div
              key={material.material_id}
              className="material-card group hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items:center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
                    <Package className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{material.material_name}</h3>
                </div>
                <div className={`p-2 rounded-lg ${statusDisplay.bg}`}>
                  <StatusIcon className={`h-5 w-5 ${statusDisplay.color}`} />
                </div>
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                      className="input-field"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveChanges}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Current Stock:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {material.stock_qty}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Stock Level</span>
                        <span>{Math.min((material.stock_qty / 200) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${
                            material.stock_qty === 0
                              ? 'danger'
                              : material.stock_qty < 50
                              ? 'danger'
                              : material.stock_qty < 100
                              ? 'warning'
                              : 'success'
                          }`}
                          style={{
                            width: `${Math.min((material.stock_qty / 200) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => startEditing(material)}
                      className="w-full btn-primary text-sm py-2"
                    >
                      Update Stock
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(material.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="card bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 border-primary-200">
        <h3 className="text-xl font-bold text-gradient-sunset font-display mb-6">Inventory Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-primary-600 mb-1">{materials.length}</div>
            <div className="text-sm font-medium text-primary-700">Total Materials</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-success-600 mb-1">
              {materials.filter(m => getStockStatus(m.stock_qty) === 'good-stock').length}
            </div>
            <div className="text-sm font-medium text-success-700">Good Stock</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-warning-600 mb-1">
              {materials.filter(m => getStockStatus(m.stock_qty) === 'low-stock').length}
            </div>
            <div className="text-sm font-medium text-warning-700">Low Stock</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-danger-600 mb-1">
              {materials.filter(m => getStockStatus(m.stock_qty) === 'out-of-stock').length}
            </div>
            <div className="text-sm font-medium text-danger-700">Out of Stock</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials