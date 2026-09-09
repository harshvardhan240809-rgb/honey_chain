import React, { useEffect, useState, useRef } from 'react'
import API from '../utils/api'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../language'

export default function Verify(){
  const { token } = useParams()
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (token) {
      setQ(token)
      check(token)
    }
  }, [token])

  async function check(value = q){
    const lookup = value.trim()
    if (!lookup) {
      setErr(t.qrOrBatch)
      return
    }

    setErr(null); setResult(null)
    setLoading(true)
    try{
      const res = await API.get(`/verify/${encodeURIComponent(lookup)}`)
      setResult(res.data)
    }catch(e){
      setErr(e.response?.data?.error || t.notFound)
    } finally {
      setLoading(false)
    }
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
      <h2 className="text-2xl font-semibold mb-4">🍯 HONEY CHAIN — {t.verify} QR</h2>
      <form className="panel p-4 rounded shadow" onSubmit={(event) => { event.preventDefault(); check() }}>
        <input placeholder={`${t.batchId} e.g. HC-2026-001`} value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded" />
        <div className="mt-3 flex space-x-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-forest text-white rounded disabled:opacity-60">{loading ? t.verifying : t.verify}</button>
          <button type="button" disabled={loading} onClick={() => { setQ('HC-2026-001'); check('HC-2026-001') }} className="px-4 py-2 border rounded disabled:opacity-60">{t.example}</button>
        </div>
      </form>

      {err && <div className="mt-4 text-red-600">{err}</div>}

      {result && (
        <div id="proof-area" ref={printRef} className="mt-4 bg-white p-4 rounded shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-green-700 font-semibold">{t.authenticityVerified} ✓</div>
              <div className="mt-2">{t.batchId}: <strong>{result.batch.id}</strong></div>
              <div>{t.hiveId}: {result.batch.hiveId}</div>
              <div>{t.harvestDate}: {result.batch.harvestDate}</div>
              <div>{t.location}: {result.batch.harvestLocation}</div>
              <div>{t.quantity}: {result.batch.quantityKg} Kg</div>
            </div>
            <div className="text-right">
              <QRCode value={`${window.location.origin}/verify/${result.batch.id}`} size={128} />
              <div className="text-xs mt-2">{t.scanToVerify}</div>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">{t.trace}</h4>
            {result.chain.map((c,i)=> <div key={i} className="text-xs text-slate-700">{c.timestamp} — {c.stage || 'Stage'} — {c.status}</div>)}
          </div>
          <div className="mt-3 flex space-x-2">
            <button onClick={printProof} className="px-3 py-1 border rounded">{t.printProof}</button>
            <a href={`${window.location.origin}/verify/${result.batch.id}`} className="px-3 py-1 border rounded" target="_blank" rel="noreferrer">{t.openLink}</a>
          </div>
        </div>
      )}
    </div>
  )
}
