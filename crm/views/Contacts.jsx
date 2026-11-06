import { useMemo, useState } from 'react'
import { parseValue, formatValue, initials, avatarFor } from '../data/mockData.js'

export default function Contacts({ cards, persona }) {
  const [q, setQ] = useState('')

  const contacts = useMemo(() => {
    const map = new Map()
    for (const c of cards) {
      if (!map.has(c.contactName)) {
        map.set(c.contactName, {
          name: c.contactName,
          organization: c.organization,
          emailOrHandle: c.emailOrHandle,
          deals: [],
        })
      }
      map.get(c.contactName).deals.push(c)
    }
    return [...map.values()].map((ct) => ({
      ...ct,
      dealCount: ct.deals.length,
      totalValue: ct.deals.reduce((s, d) => s + parseValue(d.dealValue), 0),
    }))
  }, [cards])

  const query = q.trim().toLowerCase()
  const list = contacts.filter(
    (c) =>
      !query ||
      [c.name, c.organization, c.emailOrHandle].join(' ').toLowerCase().includes(query),
  )

  return (
    <div className="space-y-5">
      <div className="anim-fade-up flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Contacts
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {list.length} {list.length === 1 ? 'person' : 'people'} in this workspace.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search contacts…"
          className="input ml-auto px-4 py-2 w-60"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((c, i) => (
          <div key={c.name} className="card stagger lift p-5" style={{ '--d': `${Math.min(i * 60, 360)}ms` }}>
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarFor(c.name)} flex items-center justify-center text-white font-extrabold shadow-lg`}
              >
                {initials(c.name)}
              </div>
              <div className="min-w-0">
                <div className="font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  {c.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {c.organization}
                  {c.emailOrHandle ? ` · ${c.emailOrHandle}` : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="chip bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                {c.dealCount} deal{c.dealCount === 1 ? '' : 's'}
              </span>
              <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {formatValue(c.totalValue, persona)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              {c.deals.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 truncate">
                    {d.summary || d.nextAction || '—'}
                  </span>
                  <span className="ml-2 shrink-0 font-semibold text-slate-600 dark:text-slate-300">
                    {d.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm text-slate-400">No contacts match your search.</p>
        </div>
      )}
    </div>
  )
}
