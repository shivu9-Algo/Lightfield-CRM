import { useEffect, useState } from 'react'
import { parseValue, formatValue } from '../data/mockData.js'
import Icon from '../components/icons.jsx'

const STAGES = ['Lead', 'Contacted', 'In Progress', 'Closed']
const STAGE_DOT = {
  Lead: 'bg-slate-400',
  Contacted: 'bg-blue-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-emerald-500',
}
const STAGE_BAR = {
  Lead: 'from-zinc-400 to-zinc-500',
  Contacted: 'from-blue-500 to-indigo-500',
  'In Progress': 'from-amber-500 to-orange-500',
  Closed: 'from-emerald-500 to-teal-500',
}

// Animated count-up for stat numbers (no library)
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      setVal(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

function StatCard({ icon, label, numeric, format, tint, index }) {
  const v = useCountUp(numeric)
  return (
    <div className="card stagger lift p-5" style={{ '--d': `${index * 70}ms` }}>
      <div className={`mb-3 w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <div className="stat-num">{format(v)}</div>
      <div className="label mt-1">{label}</div>
    </div>
  )
}

export default function Dashboard({ cards, persona, valueLabel }) {
  const active = cards.filter((c) => c.stage !== 'Closed')
  const totalValue = cards.reduce((s, c) => s + parseValue(c.dealValue), 0)
  const contacts = new Set(cards.map((c) => c.contactName)).size
  const followUps = cards.filter((c) => c.nextAction).length

  const stats = [
    { icon: 'currency', label: valueLabel === 'Deal Value' ? 'Pipeline value' : 'Sponsorship value', numeric: totalValue, format: (n) => formatValue(n, persona), tint: 'bg-lime-400/15 text-lime-600 dark:text-lime-300' },
    { icon: 'kanban', label: 'Active deals', numeric: active.length, format: (n) => Math.round(n), tint: 'bg-emerald-400/15 text-emerald-600 dark:text-emerald-300' },
    { icon: 'users', label: 'Contacts', numeric: contacts, format: (n) => Math.round(n), tint: 'bg-cyan-400/15 text-cyan-600 dark:text-cyan-300' },
    { icon: 'clock', label: 'Follow-ups due', numeric: followUps, format: (n) => Math.round(n), tint: 'bg-amber-400/15 text-amber-600 dark:text-amber-300' },
  ]

  const maxCount = Math.max(1, ...STAGES.map((s) => cards.filter((c) => c.stage === s).length))
  const recent = cards.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="anim-fade-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {persona === 'freelancer' ? 'Freelancer' : 'Club Exec'} overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your pipeline at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} index={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Stage distribution */}
        <div className="card stagger p-5" style={{ '--d': '120ms' }}>
          <h3 className="font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Pipeline by stage
          </h3>
          <div className="space-y-3.5">
            {STAGES.map((stage) => {
              const count = cards.filter((c) => c.stage === stage).length
              return (
                <div key={stage}>
                  <div className="flex items-center gap-2 text-sm mb-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${STAGE_DOT[stage]}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{stage}</span>
                    <span className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
                      {count}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${STAGE_BAR[stage]} transition-all duration-700`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent cards */}
        <div className="card stagger p-5" style={{ '--d': '180ms' }}>
          <h3 className="font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Recently added
          </h3>
          <div className="space-y-2.5">
            {recent.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STAGE_DOT[c.stage]}`} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {c.contactName}
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      {' '}· {c.organization}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {c.summary || c.nextAction}
                  </div>
                </div>
                {c.dealValue && (
                  <span className="ml-auto text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-full px-2.5 py-1 shrink-0">
                    {c.dealValue}
                  </span>
                )}
              </div>
            ))}
            {recent.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                No cards yet — capture one with AI
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
