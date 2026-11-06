import { useState } from 'react'
import Icon from '../components/icons.jsx'
import { extractDeal } from '../services/aiExtractor.js'
import { SAMPLE_SNIPPETS } from '../data/mockData.js'

export default function AICapture({ apiKey, onExtracted, goPipeline }) {
  const [rawText, setRawText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [notice, setNotice] = useState(null)

  async function handleExtract() {
    setExtracting(true)
    setNotice(null)
    try {
      const data = await extractDeal(rawText, apiKey || null)
      onExtracted(data)
      setRawText('')
      setNotice({ kind: 'ok', msg: `"${data.contactName}" added to your pipeline.` })
    } catch (e) {
      setNotice({ kind: 'err', msg: e.message || 'Extraction failed.' })
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="anim-fade-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Capture
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste any email, message, or meeting notes — one AI call turns it into a
          structured pipeline card.
        </p>
      </div>

      <section className="anim-fade-up relative overflow-hidden card" style={{ '--d': '80ms' }}>
        <div className="h-1 bg-indigo-600" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {SAMPLE_SNIPPETS.map((s, i) => (
              <button
                key={i}
                onClick={() => setRawText(s.text)}
                className="text-xs px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:-translate-y-px font-medium transition-all duration-150 active:scale-95"
              >
                {s.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 self-center">
              {apiKey ? '● Gemini Live' : '○ Smart Demo Mode (offline)'}
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            placeholder="Paste raw text here… e.g. a client email or sponsor message"
            className="input w-full p-4 resize-y"
          />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={handleExtract}
              disabled={extracting || !rawText.trim()}
              className="btn-primary"
            >
              <span className={extracting ? 'anim-pulse-soft inline-block' : ''}>
                {extracting ? 'Extracting…' : 'Extract & add to pipeline'}
              </span>
            </button>
            {notice?.kind === 'ok' && (
              <button onClick={goPipeline} className="btn-ghost !text-sm !px-4 !py-2.5">
                View in Pipeline →
              </button>
            )}
          </div>

          {notice && (
            <div
              className={`anim-fade-up mt-4 text-sm px-4 py-3 rounded-xl border ${
                notice.kind === 'ok'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
              }`}
            >
              {notice.msg}
            </div>
          )}
        </div>
      </section>

      <section
        className="anim-fade-up grid grid-cols-1 sm:grid-cols-3 gap-3"
        style={{ '--d': '140ms' }}
      >
        {[
          ['arrowRight', 'Paste anything', 'Emails, WhatsApp, Slack, meeting notes.'],
          ['spark', 'One AI call', 'Gemini 2.5 Flash with a strict JSON schema.'],
          ['kanban', 'Structured card', 'Contact, value, stage, next action, due date.'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="card lift p-4">
            <div className="mb-2 text-zinc-400 dark:text-zinc-500">
              <Icon name={icon} className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
