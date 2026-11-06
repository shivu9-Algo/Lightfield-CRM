import { useEffect, useMemo, useState } from 'react'
import Dashboard from './views/Dashboard.jsx'
import Contacts from './views/Contacts.jsx'
import Pipeline from './views/Pipeline.jsx'
import Activities from './views/Activities.jsx'
import AICapture from './views/AICapture.jsx'
import Settings from './views/Settings.jsx'
import { FREELANCER_CARDS, CLUB_CARDS } from './data/mockData.js'
import Icon from './components/icons.jsx'

const STAGES = ['Lead', 'Contacted', 'In Progress', 'Closed']
const LS_CARDS = 'lf_cards_v1'
const LS_KEY = 'lf_gemini_key'
const LS_THEME = 'lf_theme'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'contacts', label: 'Contacts', icon: 'users' },
  { id: 'pipeline', label: 'Pipeline', icon: 'kanban' },
  { id: 'activities', label: 'Activities', icon: 'clock' },
  { id: 'capture', label: 'AI Capture', icon: 'spark' },
  { id: 'settings', label: 'Settings', icon: 'sliders' },
]

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  pipeline: 'Pipeline',
  activities: 'Activities',
  capture: 'AI Capture',
  settings: 'Settings',
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function seedCards() {
  return [...FREELANCER_CARDS, ...CLUB_CARDS]
}

function loadCards() {
  try {
    const raw = localStorage.getItem(LS_CARDS)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted storage → reseed */ }
  return seedCards()
}

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [persona, setPersona] = useState('freelancer')
  const [cards, setCards] = useState(loadCards)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '')
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_THEME) || 'system')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dark =
    theme === 'dark' || (theme === 'system' && systemDark())

  // Apply theme + watch OS changes in "system" mode
  useEffect(() => {
    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemDark())
      document.documentElement.classList.toggle('dark', isDark)
    }
    apply()
    localStorage.setItem(LS_THEME, theme)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(LS_CARDS, JSON.stringify(cards))
  }, [cards])

  const valueLabel = persona === 'freelancer' ? 'Deal Value' : 'Sponsorship Tier'
  const visibleCards = useMemo(
    () => cards.filter((c) => c.persona === persona),
    [cards, persona],
  )
  const contactCount = useMemo(
    () => new Set(visibleCards.map((c) => c.contactName)).size,
    [visibleCards],
  )
  const activityCount = visibleCards.filter((c) => c.nextAction).length

  const badges = {
    contacts: contactCount,
    pipeline: visibleCards.length,
    activities: activityCount,
  }

  function go(id) {
    setView(id)
    setSidebarOpen(false)
  }

  function addCard(data) {
    setCards((prev) => [{ ...data, id: uid(), persona }, ...prev])
  }

  function moveCard(id, dir) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const i = STAGES.indexOf(c.stage)
        const next = Math.min(STAGES.length - 1, Math.max(0, i + dir))
        return { ...c, stage: STAGES[next] }
      }),
    )
  }

  function deleteCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  function completeActivity(id) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, nextAction: '', dueDate: '' } : c)),
    )
  }

  function resetDemo() {
    setCards(seedCards())
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-500/25">
          <Icon name="logo" className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
            Lightfield
          </div>
          <div className="label mt-1">Mini CRM</div>
        </div>
      </div>

      {/* Workspace mode */}
      <div className="px-4 mb-5">
        <div className="label px-1.5 mb-2">Workspace mode</div>
        <div className="seg">
          {[
            ['freelancer', 'Freelance'],
            ['club', 'Club Exec'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPersona(key)}
              className={`seg-btn flex-1 ${persona === key ? 'seg-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => go(item.id)}
            className={`navlink ${view === item.id ? 'navlink-active' : ''}`}
          >
            <Icon name={item.icon} className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
            {badges[item.id] != null && badges[item.id] > 0 && (
              <span
                className={`ml-auto text-[11px] font-bold rounded-full px-2 py-0.5 ${
                  view === item.id
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {badges[item.id]}
              </span>
            )}
            {item.id === 'capture' && (
              <span
                className={`ml-auto text-[10px] font-extrabold rounded-full px-2 py-0.5 tracking-wide ${
                  view === item.id
                    ? 'bg-white/25 text-white'
                    : 'bg-lime-400 text-zinc-950'
                }`}
              >
                AI
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom: theme quick toggle */}
      <div className="p-4">
        <button
          onClick={() => setTheme(dark ? 'light' : 'dark')}
          className="navlink"
          title="Toggle dark / light mode"
        >
          <Icon name={dark ? 'sun' : 'moon'} className="w-5 h-5 shrink-0" />
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <p className="text-[11px] text-slate-400 dark:text-slate-600 text-center mt-3">
          v1.0 · React + Tailwind
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-r border-slate-200/70 dark:border-slate-800/70 z-20">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="anim-fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="anim-fade-up absolute inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="px-4 sm:px-8 py-3.5 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Open menu"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <h1
              key={view + persona}
              className="anim-fade-up text-lg font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              {VIEW_TITLES[view]}
            </h1>
            <span className="chip bg-zinc-900/[0.05] dark:bg-white/[0.07] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
              {persona === 'freelancer' ? 'Freelancer' : 'Club Exec'}
            </span>
            <button
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              className="ml-auto w-9 h-9 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.04] flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/25 transition-all active:scale-95"
              title="Toggle dark / light mode"
            >
              <Icon name={dark ? 'sun' : 'moon'} className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>

        <main key={view} className="anim-fade-up px-4 sm:px-8 py-6 max-w-7xl">
          {view === 'dashboard' && (
            <Dashboard cards={visibleCards} persona={persona} valueLabel={valueLabel} />
          )}
          {view === 'contacts' && <Contacts cards={visibleCards} persona={persona} />}
          {view === 'pipeline' && (
            <Pipeline
              cards={visibleCards}
              valueLabel={valueLabel}
              onMove={moveCard}
              onDelete={deleteCard}
            />
          )}
          {view === 'activities' && (
            <Activities
              cards={visibleCards}
              onDone={completeActivity}
              goPipeline={() => go('pipeline')}
            />
          )}
          {view === 'capture' && (
            <AICapture
              apiKey={apiKey}
              onExtracted={addCard}
              goPipeline={() => go('pipeline')}
            />
          )}
          {view === 'settings' && (
            <Settings
              theme={theme}
              setTheme={setTheme}
              apiKey={apiKey}
              setApiKey={setApiKey}
              onReset={resetDemo}
              cards={cards}
            />
          )}
        </main>
      </div>
    </div>
  )
}
