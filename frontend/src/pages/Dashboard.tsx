import React, { useState, useEffect } from 'react'
import { Calendar, Package, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { API_BASE_URL } from '../config'

interface DashboardStats {
  totalOrders: number
  availableOrders: number
  shortageOrders: number
  totalMaterials: number
  lowStockMaterials: number
  outOfStockMaterials: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    availableOrders: 0,
    shortageOrders: 0,
    totalMaterials: 0,
    lowStockMaterials: 0,
    outOfStockMaterials: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersResponse, materialsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/orders`),
        fetch(`${API_BASE_URL}/materials`)
      ])

      const orders = await ordersResponse.json()
      const materials = await materialsResponse.json()

      setStats({
        totalOrders: orders.length,
        availableOrders: orders.filter((o: any) => !o.hasShortage).length,
        shortageOrders: orders.filter((o: any) => o.hasShortage).length,
        totalMaterials: materials.length,
        lowStockMaterials: materials.filter((m: any) => m.stock_qty < 50 && m.stock_qty > 0).length,
        outOfStockMaterials: materials.filter((m: any) => m.stock_qty === 0).length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, gradient, description }: any) => (
    <div className={`card bg-gradient-to-br ${gradient} border-${color}-200 group hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-xl group-hover:bg-${color}-200 transition-colors duration-300`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: any) => (
    <button
      onClick={onClick}
      className={`card bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200 hover:from-${color}-100 hover:to-${color}-200 transition-all duration-300 group hover:scale-105`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}-200 rounded-xl group-hover:bg-${color}-300 transition-colors duration-300`}>
          <Icon className={`h-6 w-6 text-${color}-700`} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin">
            <div className="w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-sunset font-display">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to your production planning overview</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Calendar}
          color="primary"
          gradient="from-primary-50 to-blue-50"
          description="Active production orders"
        />
        <StatCard
          title="Available Orders"
          value={stats.availableOrders}
          icon={CheckCircle}
          color="success"
          gradient="from-success-50 to-green-50"
          description="Ready for production"
        />
        <StatCard
          title="Shortage Orders"
          value={stats.shortageOrders}
          icon={AlertTriangle}
          color="danger"
          gradient="from-danger-50 to-red-50"
          description="Need attention"
        />
        <StatCard
          title="Total Materials"
          value={stats.totalMaterials}
          icon={Package}
          color="warning"
          gradient="from-warning-50 to-orange-50"
          description="In inventory"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="View Planning Board"
            description="Drag and drop order scheduling"
            icon={Calendar}
            color="primary"
            onClick={() => window.location.href = '/planning'}
          />
          <QuickActionCard
            title="Manage Materials"
            description="Update inventory levels"
            icon={Package}
            color="success"
            onClick={() => window.location.href = '/materials'}
          />
          <QuickActionCard
            title="View Analytics"
            description="Production insights and reports"
            icon={BarChart3}
            color="warning"
            onClick={() => alert('Analytics coming soon!')}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="card bg-gradient-to-br from-danger-50 to-red-50 border-danger-200">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-danger-600" />
          <h2 className="text-xl font-bold text-danger-800">Attention Required</h2>
        </div>
        <div className="space-y-3">
          {stats.shortageOrders > 0 && (
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
              <span className="text-danger-700 font-medium">{stats.shortageOrders} orders have material shortages</span>
              <button className="btn-danger text-sm">View Details</button>
            </div>
          )}
          {stats.outOfStockMaterials > 0 && (
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
              <span className="text-danger-700 font-medium">{stats.outOfStockMaterials} materials are out of stock</span>
              <button className="btn-danger text-sm">Restock</button>
            </div>
          )}
          {stats.shortageOrders === 0 && stats.outOfStockMaterials === 0 && (
            <div className="flex items-center space-x-3 p-3 bg-success-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success-600" />
              <span className="text-success-700 font-medium">All systems operational!</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Order A-001 scheduled</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-success-100 rounded-lg">
              <Package className="h-5 w-5 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Steel Plate stock updated</p>
              <p className="text-sm text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Low stock alert: Aluminum Sheet</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard