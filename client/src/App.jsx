import React from 'react'
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Hives from './pages/Hives'
import HiveDetails from './pages/HiveDetails'
import Batches from './pages/Batches'
import Blockchain from './pages/Blockchain'
import Verify from './pages/Verify'
import Consumer from './pages/Consumer'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Lab from './pages/Lab'
import Layout from './components/Layout'
import { getAuthSession, getDefaultRoute } from './auth'

function ProtectedRoute({ allowedRoles = ['beekeeper', 'admin', 'lab'] }) {
  const auth = getAuthSession()

  if (!auth) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to={getDefaultRoute(auth.role)} replace />
  }

  return <Outlet />
}

export default function App() {
  const auth = getAuthSession()

  return (
    <Routes>
      <Route path="/" element={auth ? <Navigate to={getDefaultRoute(auth.role)} replace /> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify/:token" element={<Layout><Verify /></Layout>} />
      <Route path="/verify" element={<Layout><Verify /></Layout>} />
      <Route path="/consumer" element={<Layout><Consumer /></Layout>} />

      <Route element={<ProtectedRoute allowedRoles={['beekeeper', 'admin']} />}>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/hives" element={<Layout><Hives /></Layout>} />
        <Route path="/hives/:id" element={<Layout><HiveDetails /></Layout>} />
        <Route path="/batches" element={<Layout><Batches /></Layout>} />
        <Route path="/blockchain/:id" element={<Layout><Blockchain /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['lab']} />}>
        <Route path="/lab" element={<Layout><Lab /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
      </Route>

      <Route path="*" element={<Layout><div className="p-8">Page not found. <Link to="/">Home</Link></div></Layout>} />
    </Routes>
  )
}
