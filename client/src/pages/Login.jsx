import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_USERS, getAuthSession, getDefaultRoute, loginUser } from '../auth'
import { useLanguage } from '../language'

export default function Login() {
  const navigate = useNavigate()
  const auth = getAuthSession()
  const { language, toggleLanguage, t } = useLanguage()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState('user')

  useEffect(() => {
    if (auth) {
      navigate(getDefaultRoute(auth.role), { replace: true })
    }
  }, [auth, navigate])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const useDemoRole = (role) => {
    const demoUser = AUTH_USERS[role]
    setSelectedRole(role)
    setForm({ username: demoUser.username, password: demoUser.password })
  }

  const submitLogin = (event) => {
    event.preventDefault()
    const session = loginUser(form.username, form.password)

    if (!session) {
      setError('Invalid username or password. Try the demo credentials below.')
      return
    }

    navigate(getDefaultRoute(session.role), { replace: true })
  }

  return (
    <div className="min-h-screen bg-honey-gradient p-6">
      <div className="mx-auto flex max-w-6xl justify-end">
        <button type="button" onClick={toggleLanguage} className="rounded border border-amber-300/60 px-3 py-1 text-sm font-bold text-forest" aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}>
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>
      <div className="max-w-6xl mx-auto pt-8 pb-12">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div className="space-y-6">
            <div className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-forest">
              <span className="brand-mark tiny" aria-label="Honey Chain logo" />
              Honey Chain Platform
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black text-forest leading-tight">
                {t.traceEveryDrop}
              </h1>
              <p className="mt-5 text-lg text-slate-900 max-w-xl">{t.monitorBees}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-2xl p-4">
                <div className="text-2xl font-bold text-forest">24/7</div>
                <div className="text-sm text-slate-900">{t.hiveMonitoring}</div>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <div className="text-2xl font-bold text-forest">3x</div>
                <div className="text-sm text-slate-900">{t.fasterTraceability}</div>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <div className="text-2xl font-bold text-forest">100%</div>
                <div className="text-sm text-slate-900">{t.batchVisibility}</div>
              </div>
            </div>

            <div className="product-scene glass-panel rounded-[28px] overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-600">{t.liveHarvest}</div>
                  <div className="text-2xl font-bold text-forest">Batch HC-2026-001</div>
                </div>
                <div className="status-pill">{t.verified}</div>
              </div>

              <div className="product-body">
                <div className="honey-jar">
                  <div className="jar-lid" />
                  <div className="jar-glass">
                    <div className="jar-liquid" />
                  </div>
                </div>

                <div className="mini-panel">
                  <div className="mini-label">Temperature</div>
                  <div className="mini-value">34.8°C</div>
                  <div className="mini-meter">
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[30px] p-6 md:p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="text-3xl font-bold text-forest">{t.welcome}</div>
              <p className="text-sm text-slate-800 mt-2">{t.signInContinue}</p>
            </div>

            <div className="role-toggle mb-5">
              {Object.keys(AUTH_USERS).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => useDemoRole(role)}
                  className={selectedRole === role ? 'active' : ''}
                >
                  {role === 'admin' ? 'Admin' : 'User'}
                </button>
              ))}
            </div>

            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900">{t.username}</label>
                <input
                  value={form.username}
                  onChange={handleChange('username')}
                  className="mt-1 w-full border border-amber-200 rounded-xl p-3 input-field focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder={t.adminOrUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900">{t.password}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  className="mt-1 w-full border border-amber-200 rounded-xl p-3 input-field focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder={t.enterPassword}
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button type="submit" className="w-full bg-forest text-white rounded-xl p-3 font-semibold hover:bg-[#163d34] transition-all shadow-lg shadow-amber-200/50">
                {t.loginDashboard}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-slate-900">{t.quickDemo}</div>
              {Object.values(AUTH_USERS).map((user) => (
                <button
                  key={user.role}
                  type="button"
                  onClick={() => useDemoRole(user.role)}
                  className="w-full text-left border border-amber-200 rounded-xl p-3 demo-btn transition"
                >
                  <div className="font-semibold text-forest">{user.name}</div>
                  <div className="text-xs text-slate-800">{user.username} / {user.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <div className="text-center mb-8">
            <div className="section-kicker">{t.whyTeams}</div>
            <h2 className="text-3xl font-bold text-forest mt-3">{t.trustEveryStep}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: t.liveHiveInsights, text: t.liveHiveText },
              { title: t.blockchainProof, text: t.blockchainProofText },
              { title: t.consumerConfidence, text: t.consumerConfidenceText },
            ].map((feature) => (
              <div key={feature.title} className="glass-panel rounded-2xl p-6">
                <div className="feature-icon">✦</div>
                <h3 className="text-xl font-semibold text-forest mt-4">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer className="mt-16 border-t border-amber-200/80 footer-panel">
        <div className="max-w-6xl mx-auto py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-900 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="brand-mark tiny" aria-label="Honey Chain logo" />
            <span className="font-semibold text-forest dark:text-amber-300">Honey Chain</span>
          </div>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
          <div>© 2026 Honey Chain</div>
        </div>
      </footer>
    </div>
  )
}
