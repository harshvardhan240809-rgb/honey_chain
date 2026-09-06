import React from 'react'
import { NavLink } from 'react-router-dom'
import { getAuthSession } from '../auth'

const commonLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/hives', label: 'Hives' },
  { to: '/batches', label: 'Batches' },
  { to: '/verify', label: 'Verify' },
  { to: '/consumer', label: 'Consumer' },
]

export default function Sidebar(){
  const auth = getAuthSession()
  const role = auth?.role || 'user'

  return (
    <aside className="w-64 bg-white border-r p-4 hidden md:block">
      <div className="mb-6">
        <div className="text-2xl font-bold text-forest">Honey Chain</div>
        <div className="text-sm text-gray-500">{role === 'admin' ? 'Admin Workspace' : 'User Workspace'}</div>
      </div>
      <nav className="space-y-2">
        {commonLinks.map(l=> (
          <NavLink key={l.to} to={l.to} className={({isActive})=>`block p-2 rounded ${isActive? 'bg-honey text-white':'text-gray-700 hover:bg-gray-100'}`} end>
            {l.label}
          </NavLink>
        ))}

        {role === 'admin' && (
          <NavLink to="/admin" className={({isActive})=>`block p-2 rounded ${isActive? 'bg-forest text-white':'text-gray-700 hover:bg-gray-100'}`} end>
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
