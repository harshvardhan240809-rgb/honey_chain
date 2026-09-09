import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { useLanguage } from '../language'

export default function Lab() {
  const [batches, setBatches] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const { t } = useLanguage()
  const [form, setForm] = useState({
    testType: 'MOISTURE & PURITY',
    result: 'PASSED',
    certificateNumber: 'HC-LAB-2026-118',
    testingDate: new Date().toISOString().slice(0, 10),
    remarks: 'Sample passed with consistent floral profile and acceptable moisture range.'
  })

  useEffect(() => {
    API.get('/lab/batches')
      .then((response) => {
        setBatches(response.data)
        if (response.data[0]) setSelectedId(response.data[0].id)
      })
      .catch(() => setBatches([]))
  }, [])

  const submitVerification = async () => {
    if (!selectedId) return

    await API.post('/lab/verifications', {
      batchId: selectedId,
      ...form
    })

    const response = await API.get('/lab/batches')
    setBatches(response.data)
  }

  const selectedBatch = batches.find((batch) => batch.id === selectedId) || batches[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300">{t.labPortal}</p>
          <h2 className="text-3xl font-bold text-white">{t.verificationQueue}</h2>
        </div>
        <div className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-200">
          {t.demoLab}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
          <h3 className="mb-4 text-xl font-semibold text-white">{t.submittedBatches}</h3>
          <div className="space-y-3">
            {batches.map((batch) => (
              <button
                key={batch.id}
                type="button"
                onClick={() => setSelectedId(batch.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedBatch?.id === batch.id ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 bg-slate-950/50'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-white">{batch.id}</div>
                    <div className="text-sm text-slate-300">{batch.floralSource} · {batch.harvestLocation}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${batch.labStatus === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300' : batch.labStatus === 'FAILED' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {batch.labStatus || 'PENDING'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
          <h3 className="mb-4 text-xl font-semibold text-white">{t.labVerificationForm}</h3>
          {selectedBatch ? (
            <div className="space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-slate-950/50 p-3">
                <div className="font-semibold text-amber-200">{selectedBatch.id}</div>
                <div className="mt-1 text-slate-300">{t.beekeeper}: {selectedBatch.beekeeper}</div>
                <div className="text-slate-300">{t.harvest}: {selectedBatch.harvestDate}</div>
              </div>

              <label className="block">
                <span className="mb-1 block text-slate-300">{t.testType}</span>
                <input className="w-full rounded-xl border border-slate-600 bg-slate-950 p-2.5 text-white" value={form.testType} onChange={(e) => setForm({ ...form, testType: e.target.value })} />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">{t.result}</span>
                <select className="w-full rounded-xl border border-slate-600 bg-slate-950 p-2.5 text-white" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
                  <option value="PASSED">PASSED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REQUIRES_REVIEW">REQUIRES_REVIEW</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">{t.certificateNumber}</span>
                <input className="w-full rounded-xl border border-slate-600 bg-slate-950 p-2.5 text-white" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">{t.testingDate}</span>
                <input type="date" className="w-full rounded-xl border border-slate-600 bg-slate-950 p-2.5 text-white" value={form.testingDate} onChange={(e) => setForm({ ...form, testingDate: e.target.value })} />
              </label>

              <label className="block">
                <span className="mb-1 block text-slate-300">{t.remarks}</span>
                <textarea rows="3" className="w-full rounded-xl border border-slate-600 bg-slate-950 p-2.5 text-white" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
              </label>

              <button type="button" onClick={submitVerification} className="w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-400">
                {t.submitVerification}
              </button>
            </div>
          ) : (
            <div className="text-slate-300">{t.noBatches}</div>
          )}
        </div>
      </div>
    </div>
  )
}
