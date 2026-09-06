import React, {useEffect, useState} from 'react'
import API from '../utils/api'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'

export default function Batches(){
  const [batches, setBatches] = useState([])
  useEffect(()=>{API.get('/batches').then(r=>setBatches(r.data)).catch(()=>{})},[])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Honey Batches</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {batches.map(b=> (
          <div key={b.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{b.id}</div>
                <div className="font-semibold">{b.hiveId} — {b.beekeeper}</div>
                <div className="text-xs text-gray-500">{b.harvestDate} • {b.quantityKg} Kg</div>
              </div>
              <div className="text-right">
                <QRCode value={b.id} size={64} />
                <div className="mt-2"><Link to={`/blockchain/${b.id}`} className="text-xs text-blue-600">Trace →</Link></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
