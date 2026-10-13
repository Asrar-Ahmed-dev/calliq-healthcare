import { DUE_HOURS_BY_PRIORITY, type Analysis } from './schema'

export function maskId(value?: string): string | undefined {
  if (!value) return value
  const trimmed = value.trim()
  if (trimmed.startsWith('****')) return trimmed
  const alnum = trimmed.replace(/[^a-zA-Z0-9]/g, '')
  if (alnum.length <= 4) return `****${alnum}`
  return `****${alnum.slice(-4)}`
}

const PHONE_PATTERN = /(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?(\d{4})\b/g
const SSN_PATTERN = /\b\d{3}-\d{2}-(\d{4})\b/g

export function maskFreeText(text: string): string {
  return text
    .replace(SSN_PATTERN, (_m, last4: string) => `***-**-${last4}`)
    .replace(PHONE_PATTERN, (_m, _cc, last4: string) => `(***) ***-${last4}`)
}

/**
 * Enforces masking and the priority → due-date policy server-side so the UI
 * stays consistent regardless of what the model returns.
 */
export function normalizeAnalysis(analysis: Analysis): Analysis {
  const e = analysis.entities
  return {
    ...analysis,
    summary: maskFreeText(analysis.summary),
    entities: {
      ...e,
      memberId: maskId(e.memberId),
      claimNumber: maskId(e.claimNumber),
      other: e.other?.map(maskFreeText),
    },
    patientRequests: analysis.patientRequests.map(maskFreeText),
    complaints: analysis.complaints.map(maskFreeText),
    actions: analysis.actions.map((a) => ({
      ...a,
      title: maskFreeText(a.title),
      dueInHours: DUE_HOURS_BY_PRIORITY[a.priority],
    })),
  }
}

export function hasRedactions(analysis: Analysis): boolean {
  const e = analysis.entities
  return Boolean(e.memberId || e.claimNumber)
}

export function formatDue(iso: string): string {
  const due = new Date(iso)
  const diffH = (due.getTime() - Date.now()) / 36e5
  if (diffH < 0) return `Overdue · ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  if (diffH < 24) return `in ${Math.max(1, Math.round(diffH))}h · ${due.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
  return due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatRelative(iso: string): string {
  const diffMin = (Date.now() - new Date(iso).getTime()) / 6e4
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${Math.round(diffMin)}m ago`
  const h = diffMin / 60
  if (h < 24) return `${Math.round(h)}h ago`
  return `${Math.round(h / 24)}d ago`
}

export function summaryToText(id: string, a: Analysis): string {
  const lines = [
    `CallIQ Summary — ${id}`,
    `Category: ${a.category} | Caller: ${a.callerType} | Sentiment: ${a.sentiment} | Urgency: ${a.urgency} | Status: ${a.resolutionStatus}`,
    '',
    a.summary,
  ]
  if (a.actions.length) {
    lines.push('', 'Action items:')
    a.actions.forEach((x) => lines.push(`- [${x.priority}] ${x.title} → ${x.team}`))
  }
  if (a.riskFlags.length) {
    lines.push('', 'Risk flags:')
    a.riskFlags.forEach((r) => lines.push(`- ${r}`))
  }
  return lines.join('\n')
}
