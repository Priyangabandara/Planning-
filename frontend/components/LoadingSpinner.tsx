import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin">
          <div className="w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-primary-100 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading text */}
      <div className="ml-4">
        <div className="text-lg font-medium text-gray-700 animate-pulse">Loading...</div>
        <div className="text-sm text-gray-500">Please wait</div>
      </div>
    </div>
  )
}

export default LoadingSpinner