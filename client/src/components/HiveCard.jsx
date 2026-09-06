import React from 'react'
import { Link } from 'react-router-dom'

export default function HiveCard({h}){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{h.id}</div>
          <div className="font-semibold">{h.location}</div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded ${h.health==='Healthy'? 'bg-green-100 text-green-700': h.health==='Warning'? 'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{h.health}</div>
          <Link to={`/hives/${h.id}`} className="text-xs text-blue-600">Details →</Link>
        </div>
      </div>
    </div>
  )
}
