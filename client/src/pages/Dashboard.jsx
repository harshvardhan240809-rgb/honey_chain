import React, {useEffect, useState} from 'react'
import API from '../utils/api'
import HiveCard from '../components/HiveCard'
import ChartLine from '../components/ChartLine'
import { useLanguage } from '../language'

function makeSeries(history, key){
  return history.slice(-20).map((s,i)=>({label: i, [key]: s[key]}))
}

export default function Dashboard(){
  const [hives, setHives] = useState([])
  const { t } = useLanguage()
  useEffect(()=>{
    fetchHives()
    const t = setInterval(fetchHives, 8000)
    return ()=>clearInterval(t)
  },[])

  async function fetchHives(){
    try{
      const res = await API.get('/hives')
      setHives(res.data)
    }catch(e){
      console.error(e)
    }
  }

  const total = hives.length
  const healthy = hives.filter(h=>h.health==='Healthy').length

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-4 rounded shadow">{t.totalHives}<div className="text-2xl font-bold">{total}</div></div>
        <div className="panel p-4 rounded shadow">{t.healthyHives}<div className="text-2xl font-bold">{healthy}</div></div>
        <div className="panel p-4 rounded shadow">{t.honeyProduced}<div className="text-2xl font-bold">35 Kg</div></div>
        <div className="panel p-4 rounded shadow">{t.activeBatches}<div className="text-2xl font-bold">3</div></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="panel p-4 rounded shadow mb-4">
            <h3 className="font-semibold">{t.hiveWeight}</h3>
            <ChartLine data={makeSeries(hives[0]?.last? hives[0].history || hives[0].last : [], 'weight')} dataKey="weight" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel p-4 rounded shadow">
              <h4 className="font-semibold">{t.temperature}</h4>
              <ChartLine data={makeSeries(hives[0]?.history||[], 'temperature')} dataKey="temperature" stroke="#F87171" />
            </div>
            <div className="panel p-4 rounded shadow">
              <h4 className="font-semibold">{t.humidity}</h4>
              <ChartLine data={makeSeries(hives[0]?.history||[], 'humidity')} dataKey="humidity" stroke="#60A5FA" />
            </div>
          </div>
        </div>

        <div>
          <div className="panel p-4 rounded shadow mb-4">
            <h4 className="font-semibold">{t.alerts}</h4>
            <ul className="mt-2 text-sm text-slate-700 space-y-2">
              <li className="text-yellow-700">⚠ {t.hiveAlert}</li>
            </ul>
          </div>

          <div className="panel p-4 rounded shadow">
            <h4 className="font-semibold">{t.hives}</h4>
            <div className="space-y-2 mt-2">
              {hives.map(h=> <HiveCard key={h.id} h={h} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
