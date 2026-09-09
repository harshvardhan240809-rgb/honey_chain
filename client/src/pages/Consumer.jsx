import React, {useState} from 'react'
import { Link } from 'react-router-dom'

export default function Consumer(){
  const [q, setQ] = useState('')
  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Consumer Lookup</h2>
      <div className="panel p-4 rounded shadow">
        <input placeholder="Enter or paste Batch ID" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded" />
        <div className="mt-3 flex space-x-2">
          <Link to={`/verify`} className="px-4 py-2 bg-forest text-white rounded">Go Verify</Link>
        </div>
      </div>
    </div>
  )
}
