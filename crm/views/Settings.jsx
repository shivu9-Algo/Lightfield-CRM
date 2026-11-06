import { useState } from 'react'
import Icon from '../components/icons.jsx'

export default function Settings({ theme, setTheme, apiKey, setApiKey, onReset, cards }) {
  const [keyInput, setKeyInput] = useState('')
  const [saved, setSaved] = useState(false)

  function saveKey() {
    const k = keyInput.trim()
    if (!k) return
    localStorage.setItem('lf_gemini_key', k)
    setApiKey(k)
    setKeyInput('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function clearKey() {
    localStorage.removeItem('lf_gemini_key')
    setApiKey('')
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'mini-crm-export.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const themes = [
    ['light', 'Light'],
    ['dark', 'Dark'],
    ['system', 'System'],
  ]

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="anim-fade-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Appearance, AI, and data controls.
        </p>
      </div>

      {/* Appearance */}
      <section className="card stagger p-5 sm:p-6" style={{ '--d': '60ms' }}>
        <h3 className="font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          Appearance
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Pick your theme — it applies instantly across the whole app.
        </p>
        <div className="seg w-fit">
          {themes.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`seg-btn ${theme === key ? 'seg-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* AI */}
      <section className="card stagger p-5 sm:p-6" style={{ '--d': '120ms' }}>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold tracking-tight text-slate-900 dark:text-white">
            AI Extraction
          </h3>
          <span
            className={`chip border ${
              apiKey
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {apiKey ? '● Gemini Live' : '○ Smart Demo Mode'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Optional Gemini 2.5 Flash key, stored only in your browser. Without it, the
          offline demo parser runs instead.
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Paste API key…"
            className="input flex-1 min-w-[200px] px-4 py-2.5"
          />
          <button onClick={saveKey} className="btn-primary !px-5">
            Save
          </button>
          {apiKey && (
            <button
              onClick={clearKey}
              className="text-sm px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium transition-all active:scale-95"
            >
              Remove
            </button>
          )}
        </div>
        {saved && (
          <p className="anim-fade-up text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            ✓ Key saved — live extraction enabled.
          </p>
        )}
      </section>

      {/* Data */}
      <section className="card stagger p-5 sm:p-6" style={{ '--d': '180ms' }}>
        <h3 className="font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {cards.length} cards stored locally in your browser.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportJSON} className="btn-ghost !text-sm !px-4 !py-2.5">
            <Icon name="download" className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={onReset}
            className="text-sm px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-medium transition-all active:scale-95"
          >
            ↺ Reset demo data
          </button>
        </div>
      </section>

      {/* About */}
      <section className="card stagger p-5 sm:p-6" style={{ '--d': '240ms' }}>
        <h3 className="font-bold tracking-tight text-slate-900 dark:text-white mb-1">
          About
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Lightfield Mini CRM v1.0 — an AI-native micro-CRM for freelancers and student
          clubs. React + Vite + Tailwind. One structured LLM call turns unstructured
          text into pipeline cards.
        </p>
      </section>
    </div>
  )
}
