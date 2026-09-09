import React from 'react'
import { Link } from 'react-router-dom'

export default function HiveCard({h}){
  return (
    <div className="panel p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">{h.id}</div>
          <div className="font-semibold">{h.location}</div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded ${h.health==='Healthy'? 'badge-healthy': h.health==='Warning'? 'badge-warning':'badge-critical'}`}>{h.health}</div>
          <Link to={`/hives/${h.id}`} className="text-xs link-muted">Details →</Link>
        </div>
      </div>
    </div>
  )
}
