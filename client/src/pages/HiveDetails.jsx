import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import API from '../utils/api'
import ChartLine from '../components/ChartLine'
import { useLanguage } from '../language'

export default function HiveDetails(){
  const { id } = useParams()
  const [hive, setHive] = useState(null)
  const { t } = useLanguage()

  useEffect(()=>{ if(id) API.get(`/hives/${id}`).then(r=>setHive(r.data)).catch(()=>{}) },[id])

  if(!hive) return <div>{t.loading}</div>

  const history = hive.history || []

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{hive.id}</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="panel p-4 rounded shadow">{t.location}<div className="font-semibold">{hive.location}</div></div>
        <div className="panel p-4 rounded shadow">{t.lastUpdated}<div className="font-semibold">{history[history.length-1]?.ts ?? '—'}</div></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <ChartLine data={history.slice(-30).map((s,i)=>({label:i, temperature:s.temperature}))} dataKey="temperature" />
        <ChartLine data={history.slice(-30).map((s,i)=>({label:i, humidity:s.humidity}))} dataKey="humidity" stroke="#60A5FA" />
        <ChartLine data={history.slice(-30).map((s,i)=>({label:i, weight:s.weight}))} dataKey="weight" stroke="#F6C85F" />
      </div>

    </div>
  )
}
