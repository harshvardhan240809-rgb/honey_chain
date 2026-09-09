import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { useLanguage } from '../language'

export default function Batches(){
  const [batches, setBatches] = useState([])
  const [bottles, setBottles] = useState({})
  const [generating, setGenerating] = useState('')
  const { t } = useLanguage()
  useEffect(()=>{API.get('/batches').then(r=>setBatches(r.data)).catch(()=>{})},[])

  async function generateQr(batchId) {
    setGenerating(batchId)
    try {
      const response = await API.post('/qr/generate', { batchId })
      setBottles((current) => ({ ...current, [batchId]: response.data.bottle }))
    } finally {
      setGenerating('')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t.honeyBatches}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {batches.map(b=> (
          <div key={b.id} className="panel p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900">{b.id}</div>
                <div className="font-semibold text-slate-900">{b.hiveId} — {b.beekeeper}</div>
                <div className="text-xs font-medium text-slate-700">{b.harvestDate} • {b.quantityKg} Kg</div>
              </div>
              <div className="text-right">
                <QRCode value={`${window.location.origin}${bottles[b.id]?.qrUrl || `/verify/${b.id}`}`} size={64} />
                <button type="button" onClick={() => generateQr(b.id)} disabled={generating === b.id} className="mt-2 block text-xs text-amber-700 disabled:opacity-50">
                  {generating === b.id ? t.verifying : bottles[b.id] ? t.generateAnother : t.generateQr}
                </button>
                <div className="mt-2"><Link to={`/blockchain/${b.id}`} className="text-xs text-blue-600">{t.trace} →</Link></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
