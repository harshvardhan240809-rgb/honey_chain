import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../language'

export default function Landing(){
  const { language, toggleLanguage, t } = useLanguage()
  return (
    <div className="max-w-5xl mx-auto py-16">
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={toggleLanguage} className="rounded border border-amber-300/60 px-3 py-1 text-sm font-bold text-forest" aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}>
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-forest">Honey Chain</h1>
          <p className="mt-4 text-xl">{t.fromHiveToHome}</p>
          <p className="mt-4 text-slate-700">{t.landingIntro}</p>
          <div className="mt-6 space-x-3">
            <Link to="/dashboard" className="px-4 py-2 bg-forest text-white rounded">{t.exploreDashboard}</Link>
            <Link to="/verify" className="px-4 py-2 border rounded">{t.verifyHoney}</Link>
          </div>
        </div>
        <div className="panel p-6 rounded shadow">
          <h3 className="font-semibold text-slate-900">{t.howItWorks}</h3>
          <ol className="mt-3 text-sm text-slate-800 list-decimal list-inside space-y-2">
            <li>{t.iotStep}</li>
            <li>{t.harvestStep}</li>
            <li>{t.qrStep}</li>
          </ol>
        </div>
      </div>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="panel p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">{t.smartHiveMonitoring}</h4>
          <p className="mt-2 text-sm text-slate-800">{t.monitoringText}</p>
        </div>
        <div className="panel p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">{t.blockchainTraceability}</h4>
          <p className="mt-2 text-sm text-slate-800">{t.traceabilityText}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h4 className="font-semibold text-slate-900">{t.consumerTrust}</h4>
          <p className="mt-2 text-sm text-slate-800">{t.consumerTrustText}</p>
        </div>
      </section>
    </div>
  )
}
