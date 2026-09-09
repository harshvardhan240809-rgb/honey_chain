import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../language'

export default function Consumer(){
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { t } = useLanguage()

  const openVerification = (event) => {
    event.preventDefault()
    if (q.trim()) navigate(`/verify/${q.trim()}`)
  }

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-4">{t.consumerLookup}</h2>
      <div className="panel p-4 rounded shadow">
        <form onSubmit={openVerification}>
          <input placeholder={t.qrOrBatch} value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded" />
          <button type="submit" className="mt-3 px-4 py-2 bg-forest text-white rounded">{t.verifyProduct}</button>
        </form>
      </div>
    </div>
  )
}
