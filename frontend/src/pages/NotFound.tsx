import React from 'react'

const NotFound: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-gradient-sunset font-display">Page Not Found</h1>
      <p className="text-gray-600">The page you are looking for doesn't exist.</p>
      <a href="/" className="btn-primary inline-block">Go to Dashboard</a>
    </div>
  )
}

export default NotFound