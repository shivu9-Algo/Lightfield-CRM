// One LLM call (Gemini 2.5 Flash, strict JSON schema) + a smart offline
// fallback parser, so the demo works with or without an API key.

const STAGES = ['Lead', 'Contacted', 'In Progress', 'Closed']

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    contactName: { type: 'STRING' },
    organization: { type: 'STRING' },
    emailOrHandle: { type: 'STRING' },
    stage: { type: 'STRING', enum: STAGES },
    dealValue: { type: 'STRING' },
    nextAction: { type: 'STRING' },
    dueDate: { type: 'STRING' },
    summary: { type: 'STRING' },
  },
  required: ['contactName', 'organization', 'stage', 'dealValue', 'nextAction', 'summary'],
}

const SYSTEM_PROMPT = `You extract CRM deal information from unstructured text (emails, chat messages, meeting notes).
Return ONLY valid JSON matching the required schema — no markdown, no commentary.
- stage: "Lead" unless the text clearly shows progress ("proposal sent" → "Contacted", "agreed/negotiating" → "In Progress", "done/signed" → "Closed").
- dealValue: money like "$1,800" or sponsorship tier like "Gold Sponsor"; use "" if unknown.
- dueDate: ISO date (YYYY-MM-DD) if a date is mentioned, else "".
- summary: one concise sentence.`

function normalize(obj = {}) {
  const stage = STAGES.includes(obj.stage) ? obj.stage : 'Lead'
  return {
    contactName: String(obj.contactName || 'Unknown').trim() || 'Unknown',
    organization: String(obj.organization || '').trim(),
    emailOrHandle: String(obj.emailOrHandle || '').trim(),
    stage,
    dealValue: String(obj.dealValue || '').trim(),
    nextAction: String(obj.nextAction || '').trim(),
    dueDate: String(obj.dueDate || '').trim(),
    summary: String(obj.summary || '').trim(),
  }
}

async function geminiExtract(rawText, apiKey) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' +
    encodeURIComponent(apiKey)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: rawText }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API error (${res.status}). Check the key or clear it to use demo mode.`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  return normalize(JSON.parse(text))
}

// ---------- Smart offline fallback (no key needed) ----------

function firstMatch(text, patterns) {
  for (const re of patterns) {
    const m = text.match(re)
    if (m) return (m[1] || m[0]).trim()
  }
  return ''
}

function fallbackExtract(rawText) {
  const t = rawText.trim()

  const emailOrHandle =
    firstMatch(t, [/[\w.+-]+@[\w-]+\.[\w.]+/]) ||
    firstMatch(t, [/(@[\w.]+)/]) ||
    ''

  const contactName =
    firstMatch(t, [
      /(?:i am|i'm|this is|my name is)\s+([A-Z][a-z]+(?:\s+(?!from\b)[A-Z][a-z]+){0,2})/i,
      /regards,?\s+([A-Z][a-z]+(?:\s+(?!from\b)[A-Z][a-z]+){0,2})/i,
      /^\s*[-–—]\s*([A-Z][a-z]+(?:\s+(?!from\b)[A-Z][a-z]+){0,2})\s*$/m,
      /met with\s+([A-Z][a-z]+(?:\s+(?!from\b)[A-Z][a-z]+){0,2})/i,
    ]) || 'Unknown'

  let organization = firstMatch(t, [
    /from\s+([A-Z][\w&]*(?:\s+[A-Z][\w&]*){0,2})/,
    /(?:at|with)\s+([A-Z][\w&]*(?:\s+[A-Z][\w&]*){0,2})/,
    /\(([A-Z][\w&]*(?:\s+[A-Z][\w&]*){0,2})\)/,
  ])
  if (!organization && emailOrHandle.includes('@')) {
    const domain = emailOrHandle.split('@')[1].split('.')[0]
    organization = domain.charAt(0).toUpperCase() + domain.slice(1)
  }

  const dealValue =
    firstMatch(t, [/(?:₹|\$|Rs\.?)\s?[\d,]*\d(?:\.\d+)?/]) ||
    firstMatch(t, [/((?:Platinum|Gold|Silver|Bronze)\s+Sponsor)/i]) ||
    ''

  const nextAction =
    firstMatch(t, [
      /([^.!?]*?\b(?:follow up|schedule|send|share|call|meet|discuss|confirm|get)\b[^.!?]*[.!?])/i,
    ]) || ''

  const dueDate =
    firstMatch(t, [
      /by\s+([A-Z][a-z]+\s+\d{1,2})/,
      /before\s+([A-Z][a-z]+\s+\d{1,2})/i,
      /(\d{4}-\d{2}-\d{2})/,
    ]) || ''

  const summary = (t.split(/(?<=[.!?])\s+/)[0] || '').slice(0, 140)

  const lower = t.toLowerCase()
  const stage = /signed|closed|done|won/.test(lower)
    ? 'Closed'
    : /agreed|negotiat|proposal accepted/.test(lower)
      ? 'In Progress'
      : /proposal sent|reached out|emailed/.test(lower)
        ? 'Contacted'
        : 'Lead'

  return normalize({ contactName, organization, emailOrHandle, stage, dealValue, nextAction, dueDate, summary })
}

export async function extractDeal(rawText, apiKey) {
  if (!rawText.trim()) throw new Error('Paste some text first.')
  if (apiKey) return geminiExtract(rawText, apiKey)
  // Smart Demo Extraction Mode — instant, offline
  return fallbackExtract(rawText)
}
