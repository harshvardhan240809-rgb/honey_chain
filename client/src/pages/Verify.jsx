import React, {useState} from 'react'
import API from '../utils/api'

export default function Verify(){
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  async function check(){
    setErr(null); setResult(null)
    try{
      const res = await API.get(`/verify/${q}`)
      setResult(res.data)
    }catch(e){ setErr('Not found or invalid ID') }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">🍯 HONEY CHAIN — QR Verification</h2>
      <div className="bg-white p-4 rounded shadow">
        <input placeholder="Enter Batch ID e.g. HC-2026-001" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded" />
        <div className="mt-3 flex space-x-2">
          <button onClick={check} className="px-4 py-2 bg-forest text-white rounded">Verify</button>
        </div>
      </div>

      {err && <div className="mt-4 text-red-600">{err}</div>}

      {result && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <div className="text-green-700 font-semibold">Authenticity Verified ✓</div>
          <div className="mt-2">Batch ID: {result.batch.id}</div>
          <div>Hive ID: {result.batch.hiveId}</div>
          <div>Harvest Date: {result.batch.harvestDate}</div>
          <div>Location: {result.batch.location}</div>
          <div>Quantity: {result.batch.quantityKg} Kg</div>
          <div className="mt-3">
            <h4 className="font-semibold">Trace</h4>
            {result.chain.map((c,i)=> <div key={i} className="text-xs text-gray-600">{c.timestamp} — {c.stage || 'Stage'} — {c.status}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
