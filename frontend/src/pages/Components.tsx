import React from 'react'

const ComponentsShowcase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="space-x-2">
          <button className="btn-primary">Primary</button>
          <button className="btn-secondary">Secondary</button>
          <button className="btn-success">Success</button>
          <button className="btn-danger">Danger</button>
        </div>
      </div>
    </div>
  )
}

export default ComponentsShowcase