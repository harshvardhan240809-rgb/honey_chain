import React from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex bg-honey-gradient">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
