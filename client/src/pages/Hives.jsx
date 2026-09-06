import React, {useEffect, useState} from 'react'
import API from '../utils/api'
import HiveCard from '../components/HiveCard'

export default function Hives(){
  const [hives, setHives] = useState([])
  useEffect(()=>{API.get('/hives').then(r=>setHives(r.data)).catch(()=>{})},[])
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Hives</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {hives.map(h=> <HiveCard key={h.id} h={h} />)}
      </div>
    </div>
  )
}
