import React, { useState } from 'react'
import { Copy, Check, Eye, EyeOff, Search, Mail, Lock, User } from 'lucide-react'

const Components: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    search: '',
  })

  const components = [
    {
      title: 'Buttons',
      description: 'Primary and secondary button variants with hover states',
      component: (
        <div className="space-x-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-primary" disabled>Disabled</button>
        </div>
      ),
      code: `<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>`,
    },
    {
      title: 'Form Inputs',
      description: 'Styled form inputs with focus states and icons',
      component: (
        <div className="space-y-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={formData.search}
              onChange={(e) => setFormData({ ...formData, search: e.target.value })}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ),
      code: `<input
  type="text"
  placeholder="Search..."
  className="input-field pl-10"
/>`,
    },
    {
      title: 'Cards',
      description: 'Flexible card components with various content layouts',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple Card</h3>
            <p className="text-gray-600">This is a basic card component with some content.</p>
          </div>
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Featured Card</h3>
            <p className="text-primary-700">This card has a special background and styling.</p>
          </div>
        </div>
      ),
      code: `<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>`,
    },
    {
      title: 'Alerts',
      description: 'Different types of alert messages for user feedback',
      component: (
        <div className="space-y-4 max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-700">Your action was completed successfully.</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Info</p>
                <p className="text-sm text-blue-700">Here's some helpful information.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <p className="text-green-800">Success message</p>
</div>`,
    },
  ]

  const copyToClipboard = async (text: string, componentName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(componentName)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our collection of reusable UI components built with Tailwind CSS and React.
          Each component is designed for performance and accessibility.
        </p>
      </div>

      {/* Components Grid */}
      <div className="space-y-12">
        {components.map((component, index) => (
          <div
            key={index}
            className="card animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-6">
              {/* Component Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{component.title}</h2>
                <p className="text-gray-600">{component.description}</p>
              </div>

              {/* Component Preview */}
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                {component.component}
              </div>

              {/* Code Example */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Code Example</h3>
                  <button
                    onClick={() => copyToClipboard(component.code, component.title)}
                    className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    {copied === component.title ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{component.code}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary-800 mb-2">Accessibility</h3>
              <ul className="text-primary-700 space-y-1 text-sm">
                <li>• All components support keyboard navigation</li>
                <li>• Proper ARIA labels and roles</li>
                <li>• High contrast color schemes</li>
                <li>• Screen reader friendly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary-800 mb-2">Customization</h3>
              <ul className="text-primary-700 space-y-1 text-sm">
                <li>• Easy to override with Tailwind classes</li>
                <li>• Consistent spacing and sizing</li>
                <li>• Theme-aware color schemes</li>
                <li>• Responsive by default</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Components