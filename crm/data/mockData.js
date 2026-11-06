// Pre-loaded demo data for both personas + one-click sample snippets.
// Card shape: { id, persona, contactName, organization, emailOrHandle,
//               stage, dealValue, nextAction, dueDate, summary }

export const FREELANCER_CARDS = [
  {
    id: 'f1',
    persona: 'freelancer',
    contactName: 'Rahul Verma',
    organization: 'TechSparks',
    emailOrHandle: 'rahul@techsparks.io',
    stage: 'Lead',
    dealValue: '$1,200',
    nextAction: 'Send portfolio + intro call invite',
    dueDate: '2026-11-06',
    summary: 'TechSparks needs a marketing website redesign.',
  },
  {
    id: 'f2',
    persona: 'freelancer',
    contactName: 'Maya Chen',
    organization: 'DesignLoop',
    emailOrHandle: 'maya@designloop.co',
    stage: 'Contacted',
    dealValue: '$1,800',
    nextAction: 'Follow up on proposal sent last week',
    dueDate: '2026-11-05',
    summary: 'DesignLoop wants a campaign landing page.',
  },
  {
    id: 'f3',
    persona: 'freelancer',
    contactName: 'Priya Sharma',
    organization: 'Studio Nova',
    emailOrHandle: 'priya@studionova.in',
    stage: 'In Progress',
    dealValue: '$2,500',
    nextAction: 'Share moodboards for brand redesign',
    dueDate: '2026-11-07',
    summary: 'Studio Nova brand redesign, scope agreed.',
  },
  {
    id: 'f4',
    persona: 'freelancer',
    contactName: 'Vikram Nair',
    organization: 'Loopwork',
    emailOrHandle: 'vikram@loopwork.ai',
    stage: 'Lead',
    dealValue: '$1,800',
    nextAction: 'Send proposal by the weekend',
    dueDate: '2026-11-09',
    summary: 'Loopwork needs a startup landing page before Dec 1.',
  },
]

export const CLUB_CARDS = [
  {
    id: 'c1',
    persona: 'club',
    contactName: 'Arjun Mehta',
    organization: 'InnovateCorp',
    emailOrHandle: 'arjun@innovatecorp.com',
    stage: 'Lead',
    dealValue: 'Gold Sponsor',
    nextAction: 'Send sponsorship deck',
    dueDate: '2026-11-08',
    summary: 'InnovateCorp may sponsor TechFest as Gold.',
  },
  {
    id: 'c2',
    persona: 'club',
    contactName: 'Sara Iqbal',
    organization: 'DevTools Inc',
    emailOrHandle: '@sara_dev (Twitter)',
    stage: 'Contacted',
    dealValue: 'Silver Sponsor',
    nextAction: 'Confirm logo placement details',
    dueDate: '2026-11-06',
    summary: 'DevTools Inc interested in Silver tier.',
  },
  {
    id: 'c3',
    persona: 'club',
    contactName: 'Kabir Rao',
    organization: 'FinEdge',
    emailOrHandle: 'kabir@finedge.io',
    stage: 'In Progress',
    dealValue: 'Title Sponsor',
    nextAction: 'Get MoU signed by Friday',
    dueDate: '2026-11-07',
    summary: 'FinEdge negotiating Title Sponsorship.',
  },
  {
    id: 'c4',
    persona: 'club',
    contactName: 'Neha Kulkarni',
    organization: 'ByteWorks',
    emailOrHandle: 'neha@byteworks.dev',
    stage: 'Lead',
    dealValue: 'Bronze Sponsor',
    nextAction: 'Schedule intro call',
    dueDate: '2026-11-10',
    summary: 'ByteWorks considering Bronze tier.',
  },
]

export const SAMPLE_SNIPPETS = [
  {
    label: 'Sponsor email',
    text: `Hi team,

This is Ananya Desai from CloudNine Systems. We loved your TechFest last year and would like to come on board as a Gold Sponsor (₹50,000) this time.

Our POC is ananya@cloudnine.io. Could we schedule a call next week to discuss branding and stall placement?

Regards,
Ananya`,
  },
  {
    label: 'Client message',
    text: `hey! loved your portfolio. i'm Vikram from Loopwork — we need a landing page for our startup, budget around $1,800, and we need it live before Dec 1. can you share a proposal by this weekend?`,
  },
  {
    label: 'Meeting notes',
    text: `Met with Priya Sharma (Studio Nova) today. They want a full brand redesign — logo, colors, guidelines. Agreed on $2,500. I need to follow up with moodboards by Friday and send the contract draft.`,
  },
]

// ---------- Value helpers (dashboard stats) ----------

const TIER_VALUES = {
  'title sponsor': 100000,
  platinum: 75000,
  gold: 50000,
  silver: 25000,
  bronze: 10000,
}

export function parseValue(str) {
  if (!str) return 0
  const low = String(str).toLowerCase()
  for (const key of Object.keys(TIER_VALUES)) {
    if (low.includes(key)) return TIER_VALUES[key]
  }
  const m = String(str).replace(/,/g, '').match(/[\d.]+/)
  return m ? parseFloat(m[0]) : 0
}

export function formatValue(n, persona) {
  const symbol = persona === 'club' ? '₹' : '$'
  return symbol + Math.round(n).toLocaleString('en-IN')
}

export function initials(name) {
  return String(name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const AVATAR_GRADIENTS = [
  'from-violet-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
]

export function avatarFor(name) {
  let h = 0
  for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) % 997
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length]
}
