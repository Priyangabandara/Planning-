import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Rocket, Shield, Code, ArrowRight } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Vite for instant hot reloading and blazing fast builds.',
    },
    {
      icon: Rocket,
      title: 'Modern Stack',
      description: 'React 18, TypeScript, and Tailwind CSS for the best developer experience.',
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Optimized builds with code splitting and performance best practices.',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'ESLint, Prettier, and TypeScript for clean, maintainable code.',
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to{' '}
            <span className="text-gradient">FastReact</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A modern React development framework that combines speed, performance, and developer experience.
            Build beautiful applications faster than ever before.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/components"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span>View Components</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose FastReact?
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Built with modern web technologies and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="card text-center space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-primary-100 text-lg">
              Start building your next React application with FastReact today.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-50 inline-flex items-center space-x-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home