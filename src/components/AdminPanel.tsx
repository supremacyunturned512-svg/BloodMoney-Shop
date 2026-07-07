import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div id="admin-float" className="visible">
      <button id="admin-float-toggle" onClick={() => setOpen(!open)}>
        🛡 Admin Panel
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div id="admin-float-body">
          <div style={{ marginBottom: '14px' }}>
            <Link to="/admin" className="adm-btn" style={{ display: 'block', textAlign: 'center' }}>Open Full Admin Panel</Link>
          </div>
          <p style={{ color: '#555', fontSize: '12px', textAlign: 'center' }}>
            Quick admin panel. Visit the full Admin page for complete management tools.
          </p>
        </div>
      )}
    </div>
  )
}
