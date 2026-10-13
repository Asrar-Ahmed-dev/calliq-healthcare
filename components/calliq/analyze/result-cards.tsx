import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Fingerprint,
  GraduationCap,
  Hash,
  Handshake,
  Lock,
  MessageSquareWarning,
  Pill as PillIcon,
  ShieldAlert,
  Tag,
  User,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { hasRedactions } from '@/lib/analysis-utils'
import type { Analysis } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { Pill, ResolutionBadge, SentimentBadge } from '../pills'

export function SectionCard({
  title,
  icon: Icon,
  action,
  className,
  delay = 0,
  children,
}: {
  title: string
  icon: LucideIcon
  action?: ReactNode
  className?: string
  delay?: number
  children: ReactNode
}) {
  return (
    <section
      className={cn('animate-rise rounded-2xl border bg-card p-5 shadow-sm break-inside-avoid', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" aria-hidden />
          </span>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}

const URGENCY_STYLES: Record<Analysis['urgency'], string> = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300',
  Medium: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300',
  High: 'bg-orange-50 text-orange-700 ring-orange-600/25 dark:bg-orange-500/15 dark:text-orange-300',
  Critical: 'bg-red-600 text-white ring-red-600',
}

export function SummaryCard({ analysis }: { analysis: Analysis }) {
  const meta: { label: string; value: ReactNode }[] = [
    { label: 'Category', value: <Pill className="bg-accent text-accent-foreground ring-primary/20">{analysis.category}</Pill> },
    { label: 'Caller', value: <Pill className="bg-muted text-foreground ring-border">{analysis.callerType}</Pill> },
    { label: 'Sentiment', value: <SentimentBadge sentiment={analysis.sentiment} /> },
    { label: 'Urgency', value: <Pill className={URGENCY_STYLES[analysis.urgency]}>{analysis.urgency}</Pill> },
    { label: 'Status', value: <ResolutionBadge status={analysis.resolutionStatus} /> },
  ]
  return (
    <SectionCard title="Call Summary" icon={FileText}>
      <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">{analysis.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-3 2xl:grid-cols-5">
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}

export function KeyDetailsCard({ analysis }: { analysis: Analysis }) {
  const e = analysis.entities
  const items: { label: string; value?: string; icon: LucideIcon; masked?: boolean }[] = [
    { label: 'Name', value: e.name, icon: User },
    { label: 'Member / Patient ID', value: e.memberId, icon: Fingerprint, masked: true },
    { label: 'Claim / Invoice #', value: e.claimNumber, icon: Hash, masked: true },
    { label: 'Date', value: e.appointmentDate, icon: CalendarClock },
    { label: 'Medication', value: e.medication, icon: PillIcon },
    { label: 'Amount', value: e.amount, icon: CircleDollarSign },
  ]
  const present = items.filter((i) => i.value)
  const other = e.other?.filter(Boolean) ?? []

  return (
    <SectionCard
      title="Key Details"
      icon={Tag}
      delay={60}
      action={
        hasRedactions(analysis) ? (
          <Pill className="bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Lock className="size-3" aria-hidden />
            PHI redacted
          </Pill>
        ) : null
      }
    >
      {present.length === 0 && other.length === 0 ? (
        <p className="text-sm text-muted-foreground">No identifiable details were mentioned.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {present.map((i) => (
              <div key={i.label} className="flex items-start gap-2.5 rounded-xl border bg-muted/40 px-3 py-2">
                <i.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground">{i.label}</div>
                  <div className={cn('text-sm font-medium break-words', i.masked && 'font-mono tracking-wide')}>
                    {i.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {other.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {other.map((o) => (
                <span key={o} className="rounded-lg bg-muted px-2.5 py-1 text-xs text-foreground/80">
                  {o}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

function BulletList({ items, empty, tone }: { items: string[]; empty: string; tone: 'teal' | 'amber' }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
          <span
            className={cn('mt-2 size-1.5 shrink-0 rounded-full', tone === 'teal' ? 'bg-primary' : 'bg-amber-500')}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function RequestsCard({ analysis }: { analysis: Analysis }) {
  return (
    <SectionCard title="Patient Requests" icon={ClipboardList} delay={120}>
      <BulletList items={analysis.patientRequests} empty="No explicit requests." tone="teal" />
    </SectionCard>
  )
}

export function ComplaintsCard({ analysis }: { analysis: Analysis }) {
  return (
    <SectionCard title="Complaints" icon={MessageSquareWarning} delay={150}>
      <BulletList items={analysis.complaints} empty="No complaints raised on this call." tone="amber" />
    </SectionCard>
  )
}

export function CommitmentsCard({ analysis }: { analysis: Analysis }) {
  return (
    <SectionCard title="Commitments Made by Agent" icon={Handshake} delay={180}>
      {analysis.agentCommitments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No commitments were made.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {analysis.agentCommitments.map((c) => (
            <li key={c.commitment} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-sm">{c.commitment}</span>
              {c.deadline && (
                <span className="inline-flex shrink-0 items-center gap-1 self-start rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground sm:self-auto">
                  <CalendarClock className="size-3" aria-hidden />
                  {c.deadline}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

export function RiskFlagsCard({ analysis }: { analysis: Analysis }) {
  return (
    <SectionCard
      title="Compliance & Risk Flags"
      icon={ShieldAlert}
      delay={260}
      action={
        analysis.riskFlags.length > 0 ? (
          <span className="text-xs font-medium text-red-600 tabular-nums dark:text-red-400">
            {analysis.riskFlags.length} flag{analysis.riskFlags.length > 1 ? 's' : ''}
          </span>
        ) : null
      }
    >
      {analysis.riskFlags.length === 0 ? (
        <p className="text-sm text-muted-foreground">No compliance or risk concerns detected.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {analysis.riskFlags.map((flag) => (
            <li
              key={flag}
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-sm text-red-900 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-200"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
              {flag}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

export function CoachingCard({ analysis }: { analysis: Analysis }) {
  return (
    <SectionCard title="Agent Coaching Note" icon={GraduationCap} delay={300}>
      <p className="rounded-xl border-l-4 border-primary bg-accent/50 px-4 py-3 text-sm leading-relaxed text-pretty">
        {analysis.coachingNote}
      </p>
    </SectionCard>
  )
}
