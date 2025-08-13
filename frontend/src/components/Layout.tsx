import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Calendar, Package, BarChart3, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, description: 'Overview & analytics' },
    { name: 'Planning Board', href: '/planning', icon: Calendar, description: 'Drag & drop planning' },
    { name: 'Materials', href: '/materials', icon: Package, description: 'Inventory management' },
    { name: 'Operator', href: '/operator', icon: Settings, description: 'Production logging' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="glass-effect-strong sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Calendar className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-success-400 to-success-600 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold text-gradient-sunset font-display">Threadline</span>
                  <p className="text-xs text-gray-500 -mt-1">Production Management</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <span className="block">{item.name}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-white/50 transition-all duration-300">
                <BarChart3 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-white/50 transition-all duration-300">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-white/50 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white/80 backdrop-blur-md border-t border-white/20">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect-strong border-t border-white/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <span className="text-gradient font-medium">Threadline</span>
            </div>
            <p className="text-gray-500 text-sm">
              Drag-and-drop production planning with intelligent BOM checking
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-400">
              <span>Powered by Supabase</span>
              <span>•</span>
              <span>React + TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout