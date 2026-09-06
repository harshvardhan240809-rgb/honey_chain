import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession, getDefaultRoute } from '../auth'

export default function TopNav(){
  const navigate = useNavigate()
  const auth = getAuthSession()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('honeychain-theme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('honeychain-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function handleLogout() {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar flex items-center justify-between p-4 border-b dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <button className="md:hidden">☰</button>
        <div className="brand-mark" aria-label="Honey Chain logo" />
        <Link to={auth ? getDefaultRoute(auth.role) : '/login'} className="text-lg font-semibold text-forest dark:text-amber-300">Dashboard</Link>
        <div className="text-sm text-gray-500 dark:text-slate-300">Smart Beekeeping Management</div>
      </div>
      <div className="flex items-center space-x-4">
        <input placeholder="Search" className="px-3 py-1 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        <div className="p-2">🔔</div>
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600" />
          <div className="text-sm dark:text-slate-200">{auth?.name || 'Guest'}</div>
          {auth && (
            <button onClick={handleLogout} className="text-xs border px-2 py-1 rounded dark:border-slate-600 dark:text-slate-200">Logout</button>
          )}
        </div>
      </div>
    </header>
  )
}
