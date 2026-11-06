// Minimal stroke icon set — no emoji, no icon packages.
// Usage: <Icon name="grid" className="w-5 h-5" />

const PATHS = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.6 19.6c.7-3.1 2.7-4.9 5.4-4.9s4.7 1.8 5.4 4.9" />
      <circle cx="16.8" cy="9" r="2.5" />
      <path d="M16.4 14.9c2.2.3 3.7 1.8 4.2 4" />
    </>
  ),
  kanban: (
    <>
      <rect x="3.5" y="4" width="5.2" height="16" rx="1.6" />
      <rect x="9.4" y="4" width="5.2" height="10" rx="1.6" />
      <rect x="15.3" y="4" width="5.2" height="13" rx="1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.6V12l3 2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="14.5" cy="7" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="2.3" fill="currentColor" stroke="none" />
    </>
  ),
  currency: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.6 9.6h.01M17.4 14.4h.01" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </>
  ),
  moon: <path d="M20 13.6A8 8 0 1 1 10.4 4a6.6 6.6 0 0 0 9.6 9.6z" />,
  logo: (
    <>
      <path d="M12 3.2l7.8 4.4v8.8L12 20.8l-7.8-4.4V7.6z" />
      <path d="M12 12l7.8-4.4M12 12v8.8M12 12L4.2 7.6" />
    </>
  ),
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  download: <path d="M12 4v11M7.5 11.5L12 16l4.5-4.5M4.5 20h15" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
}

export default function Icon({ name, className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  )
}
