import React, {useState, useRef} from 'react'
import API from '../utils/api'
import QRCode from 'react-qr-code'

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

  const printRef = useRef()
  function printProof(){
    if(!result) return
    const w = window.open('', '_blank')
    w.document.write('<html><head><title>Proof - ' + result.batch.id + '</title></head><body>')
    w.document.write(document.getElementById('proof-area').innerHTML)
    w.document.write('</body></html>')
    w.document.close()
    w.print()
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">🍯 HONEY CHAIN — QR Verification</h2>
      <div className="panel p-4 rounded shadow">
        <input placeholder="Enter Batch ID e.g. HC-2026-001" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded" />
        <div className="mt-3 flex space-x-2">
          <button onClick={check} className="px-4 py-2 bg-forest text-white rounded">Verify</button>
          <button onClick={()=>{ setQ('HC-2026-001'); check() }} className="px-4 py-2 border rounded">Example</button>
        </div>
      </div>

      {err && <div className="mt-4 text-red-600">{err}</div>}

      {result && (
        <div id="proof-area" ref={printRef} className="mt-4 bg-white p-4 rounded shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-green-700 font-semibold">Authenticity Verified ✓</div>
              <div className="mt-2">Batch ID: <strong>{result.batch.id}</strong></div>
              <div>Hive ID: {result.batch.hiveId}</div>
              <div>Harvest Date: {result.batch.harvestDate}</div>
              <div>Location: {result.batch.location}</div>
              <div>Quantity: {result.batch.quantityKg} Kg</div>
            </div>
            <div className="text-right">
              <QRCode value={`${window.location.origin}/verify/${result.batch.id}`} size={128} />
              <div className="text-xs mt-2">Scan to verify</div>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">Trace</h4>
            {result.chain.map((c,i)=> <div key={i} className="text-xs text-slate-700">{c.timestamp} — {c.stage || 'Stage'} — {c.status}</div>)}
          </div>
          <div className="mt-3 flex space-x-2">
            <button onClick={printProof} className="px-3 py-1 border rounded">Print Proof</button>
            <a href={`${window.location.origin}/verify/${result.batch.id}`} className="px-3 py-1 border rounded" target="_blank" rel="noreferrer">Open Link</a>
          </div>
        </div>
      )}
    </div>
  )
}
