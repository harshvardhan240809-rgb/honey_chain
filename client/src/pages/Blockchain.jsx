import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import API from '../utils/api'

export default function Blockchain(){
  const { id } = useParams()
  const [chain, setChain] = useState([])

  useEffect(()=>{ if(id) API.get(`/blockchain/${id}`).then(r=>setChain(r.data)).catch(()=>{}) },[id])

  if(!id) return <div>Missing batch id</div>
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Blockchain Trace — {id}</h2>
      <div className="space-y-3">
        {chain.map((c,i)=> (
          <div key={i} className="panel p-4 rounded shadow">
            <div className="text-sm font-medium text-slate-900">Stage: {c.stage || 'Stage ' + (i+1)}</div>
            <div className="text-xs font-medium text-slate-700">Timestamp: {c.timestamp}</div>
            <div className="text-xs text-slate-800">Tx: {c.txId || c.hash}</div>
            <div className="text-xs text-slate-600">Prev: {c.prevHash || '—'}</div>
            <div className="mt-2 text-green-700">{c.status || 'Verified'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
