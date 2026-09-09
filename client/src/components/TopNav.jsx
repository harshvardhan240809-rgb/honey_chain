import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession, getDefaultRoute } from '../auth'

export default function TopNav(){
  const navigate = useNavigate()
  const auth = getAuthSession()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('honeychain-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('honeychain-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function handleLogout() {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar flex items-center justify-between p-4 border-b border-amber-200/20 bg-[#0f172a]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden text-lg font-bold text-slate-100">☰</button>
        <div className="brand-mark" aria-label="Honey Chain logo" />
        <div className="flex items-center gap-3 min-w-0">
          <Link to={auth ? getDefaultRoute(auth.role) : '/login'} className="text-lg font-bold text-amber-300 whitespace-nowrap">Dashboard</Link>
          <div className="text-sm font-medium text-slate-200 whitespace-nowrap">Smart Beekeeping Management</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input placeholder="Search" className="px-3 py-1 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder:text-slate-400" />
        <div className="p-2 text-lg">🔔</div>
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-amber-200 border border-amber-300" />
          <div className="text-sm font-semibold text-slate-100">{auth?.name || 'Guest'}</div>
          {auth && (
            <button onClick={handleLogout} className="text-xs border border-slate-600 px-2 py-1 rounded text-slate-100 hover:bg-slate-800">Logout</button>
          )}
        </div>
      </div>
    </header>
  )
}
