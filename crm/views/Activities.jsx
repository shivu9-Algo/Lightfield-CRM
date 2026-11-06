import { useMemo } from 'react'
import Icon from '../components/icons.jsx'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Activities({ cards, onDone, goPipeline }) {
  const today = todayISO()

  const items = useMemo(
    () =>
      cards
        .filter((c) => c.nextAction)
        .slice()
        .sort((a, b) => (a.dueDate || 'zzzz').localeCompare(b.dueDate || 'zzzz')),
    [cards],
  )

  return (
    <div className="space-y-5">
      <div className="anim-fade-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Activities
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Every follow-up, sorted by due date. Tick them off as you go.
        </p>
      </div>

      <div className="card stagger overflow-hidden" style={{ '--d': '80ms' }}>
        {items.map((c, i) => {
          const overdue = c.dueDate && c.dueDate < today
          return (
            <div
              key={c.id}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                i !== items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
              }`}
            >
              <button
                onClick={() => onDone(c.id)}
                title="Mark done"
                className="w-6 h-6 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center text-emerald-600 text-sm font-bold transition-all active:scale-90"
              >
                <span className="opacity-0 hover:opacity-100">✓</span>
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {c.nextAction}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {c.contactName} · {c.organization} · {c.stage}
                </div>
              </div>
              {c.dueDate ? (
                <span
                  className={`chip shrink-0 border ${
                    overdue
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                      : 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
                  }`}
                >
                  {overdue ? 'Overdue · ' : ''}{c.dueDate}
                </span>
              ) : (
                <span className="chip shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  No date
                </span>
              )}
            </div>
          )
        })}
        {items.length === 0 && (
          <div className="p-10 text-center">
            <div className="mb-2 text-zinc-300 dark:text-zinc-600">
              <Icon name="check" className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All clear! Capture a deal to generate follow-ups.
            </p>
            <button onClick={goPipeline} className="btn-ghost mt-4">
              Go to Pipeline →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
