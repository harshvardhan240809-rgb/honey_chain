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
    <aside className="w-64 bg-[#0b1220]/90 border-r border-amber-200/20 p-4 hidden md:block backdrop-blur-sm">
      <div className="mb-6">
        <div className="text-2xl font-bold text-amber-300">Honey Chain</div>
        <div className={`mt-1 text-sm font-semibold ${role === 'admin' ? 'text-amber-300' : 'text-slate-200'}`}>
          {role === 'admin' ? 'Admin Workspace' : 'User Workspace'}
        </div>
      </div>
      <nav className="space-y-2">
        {commonLinks.map(l=> (
          <NavLink key={l.to} to={l.to} className={({isActive})=>`block p-2 rounded font-medium ${isActive? 'bg-amber-500 text-slate-950':'text-slate-200 hover:bg-slate-800/80'}`} end>
            {l.label}
          </NavLink>
        ))}

        {role === 'admin' && (
          <NavLink to="/admin" className={({isActive})=>`block p-2 rounded font-medium ${isActive? 'bg-forest text-white':'text-amber-300 hover:bg-slate-800/80'}`} end>
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
