const STAGES = ['Lead', 'Contacted', 'In Progress', 'Closed']

const COLUMN_STYLE = {
  Lead: 'bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-700/50',
  Contacted: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/70 dark:border-blue-800/40',
  'In Progress': 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40',
  Closed: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40',
}

const STAGE_DOT = {
  Lead: 'bg-slate-400',
  Contacted: 'bg-blue-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-emerald-500',
}

export default function Pipeline({ cards, valueLabel, onMove, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="anim-fade-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Pipeline
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {cards.length} card{cards.length === 1 ? '' : 's'} · move deals with ← Prev / Next →
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {STAGES.map((stage, si) => {
          const col = cards.filter((c) => c.stage === stage)
          return (
            <div
              key={stage}
              className={`stagger rounded-2xl border ${COLUMN_STYLE[stage]} backdrop-blur p-3 min-h-[190px]`}
              style={{ '--d': `${si * 70}ms` }}
            >
              <div className="flex items-center gap-2 px-1.5 mb-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${STAGE_DOT[stage]} shadow-sm`} />
                <h3 className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100">
                  {stage}
                </h3>
                <span className="ml-auto text-xs font-semibold bg-white/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 text-slate-500 dark:text-slate-300">
                  {col.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[62vh] overflow-y-auto kanban-col pr-0.5 pb-1">
                {col.map((card, ci) => (
                  <article
                    key={card.id}
                    className="stagger lift bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700/70 shadow-[0_2px_10px_rgba(15,23,42,0.05)] p-4 text-sm"
                    style={{ '--d': `${si * 70 + ci * 55}ms` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold tracking-tight text-slate-900 dark:text-white">
                          {card.contactName}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                          {card.organization}
                          {card.emailOrHandle ? ` · ${card.emailOrHandle}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => onDelete(card.id)}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg w-6 h-6 flex items-center justify-center text-base leading-none transition-colors"
                        title="Delete card"
                      >
                        ×
                      </button>
                    </div>

                    {card.dealValue && (
                      <div className="mt-2.5 inline-block text-xs font-bold text-white bg-indigo-600 rounded-full px-3 py-1">
                        {valueLabel}: {card.dealValue}
                      </div>
                    )}
                    {card.summary && (
                      <p className="mt-2.5 text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                        {card.summary}
                      </p>
                    )}
                    {card.nextAction && (
                      <p className="mt-2.5 text-[13px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200">
                        <span className="font-medium">{card.nextAction}</span>
                        {card.dueDate && (
                          <span className="text-slate-500 dark:text-slate-400"> · {card.dueDate}</span>
                        )}
                      </p>
                    )}

                    <div className="mt-3 flex gap-1.5">
                      <button
                        onClick={() => onMove(card.id, -1)}
                        disabled={STAGES.indexOf(card.stage) === 0}
                        className="btn-ghost"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => onMove(card.id, 1)}
                        disabled={STAGES.indexOf(card.stage) === STAGES.length - 1}
                        className="btn-ghost"
                      >
                        Next →
                      </button>
                    </div>
                  </article>
                ))}
                {col.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-8 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">No cards here yet</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
