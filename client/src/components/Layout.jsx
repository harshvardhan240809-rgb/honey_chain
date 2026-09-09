import React from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex bg-[#0b1220] text-slate-100">
      <Sidebar />
      <div className="flex-1 bg-[#0b1220]">
        <TopNav />
        <main className="p-6 bg-[#0b1220]">{children}</main>
      </div>
    </div>
  )
}
