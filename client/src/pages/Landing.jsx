import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="max-w-5xl mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-forest">Honey Chain</h1>
          <p className="mt-4 text-xl">From Hive to Home — Verified.</p>
          <p className="mt-4 text-slate-700">A smart platform combining IoT, blockchain and QR traceability to track honey from the beehive to the consumer.</p>
          <div className="mt-6 space-x-3">
            <Link to="/dashboard" className="px-4 py-2 bg-forest text-white rounded">Explore Dashboard</Link>
            <Link to="/verify" className="px-4 py-2 border rounded">Verify Honey</Link>
          </div>
        </div>
        <div className="panel p-6 rounded shadow">
          <h3 className="font-semibold text-slate-900">How Honey Chain Works</h3>
          <ol className="mt-3 text-sm text-slate-800 list-decimal list-inside space-y-2">
            <li>IoT sensors capture hive metrics.</li>
            <li>Harvest logged as a batch and recorded on simulated blockchain.</li>
            <li>QR codes link consumers to the batch trace.</li>
          </ol>
        </div>
      </div>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="panel p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">Smart Hive Monitoring</h4>
          <p className="mt-2 text-sm text-slate-800">Realtime-like sensor telemetry and alerts for beekeepers.</p>
        </div>
        <div className="panel p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">Blockchain Traceability</h4>
          <p className="mt-2 text-sm text-slate-800">Immutable timeline for each honey batch (simulated).</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">Consumer Trust</h4>
          <p className="mt-2 text-sm text-slate-800">Scan QR to verify origin and quality before purchase.</p>
        </div>
      </section>
    </div>
  )
}
