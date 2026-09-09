import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import API from '../utils/api'
import { useLanguage } from '../language'

export default function Blockchain(){
  const { id } = useParams()
  const [chain, setChain] = useState([])
  const { t } = useLanguage()

  useEffect(()=>{ if(id) API.get(`/blockchain/${id}`).then(r=>setChain(r.data)).catch(()=>{}) },[id])

  if(!id) return <div>{t.missingBatch}</div>
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t.blockchainTrace} — {id}</h2>
      <div className="space-y-3">
        {chain.map((c,i)=> (
          <div key={i} className="panel p-4 rounded shadow">
            <div className="text-sm font-medium text-slate-900">{t.stage}: {c.stage || c.eventType || `${t.stage} ${i+1}`}</div>
            <div className="text-xs font-medium text-slate-700">{t.timestamp}: {c.timestamp}</div>
            <div className="text-xs text-slate-800">{t.transaction}: {c.txId || c.txHash || c.hash}</div>
            <div className="text-xs text-slate-600">{t.previous}: {c.prevHash || '—'}</div>
            <div className="mt-2 text-green-700">{c.status || t.verified}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
