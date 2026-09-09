import React, {useState} from 'react'
import API from '../utils/api'

export default function Admin(){
  const [newHive, setNewHive] = useState('')
  const [newBatch, setNewBatch] = useState('')

  async function addHive(){
    if(!newHive) return
    await API.post('/hives',{id:newHive, location:'Unknown', beekeeper:'Admin'})
    setNewHive('')
    alert('Hive added')
  }
  async function addBatch(){
    if(!newBatch) return
    await API.post('/batches',{id:newBatch, hiveId:'HIVE-001', beekeeper:'Admin', harvestDate:new Date().toISOString().slice(0,10), quantityKg:5, location:'Farm'})
    setNewBatch('')
    alert('Batch added')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <div className="panel p-4 rounded shadow mb-4">
        <h4 className="font-semibold">Add Hive</h4>
        <div className="flex space-x-2 mt-2">
          <input className="border p-2 flex-1" value={newHive} onChange={e=>setNewHive(e.target.value)} placeholder="Hive ID e.g. HIVE-005" />
          <button className="px-4 py-2 bg-forest text-white rounded" onClick={addHive}>Add</button>
        </div>
      </div>

      <div className="panel p-4 rounded shadow">
        <h4 className="font-semibold">Create Batch</h4>
        <div className="flex space-x-2 mt-2">
          <input className="border p-2 flex-1" value={newBatch} onChange={e=>setNewBatch(e.target.value)} placeholder="Batch ID e.g. HC-2026-999" />
          <button className="px-4 py-2 bg-forest text-white rounded" onClick={addBatch}>Create</button>
        </div>
      </div>
    </div>
  )
}
