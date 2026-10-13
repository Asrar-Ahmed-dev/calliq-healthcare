import type { ReactNode } from 'react'
import { PRIORITY_STYLES, RESOLUTION_STYLES, SENTIMENT_STYLES, TEAM_STYLES } from '@/lib/teams'
import type { Priority, ResolutionStatus, Sentiment, Team } from '@/lib/schema'
import { cn } from '@/lib/utils'

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function TeamBadge({ team, compact = false, className }: { team: Team; compact?: boolean; className?: string }) {
  const style = TEAM_STYLES[team]
  const Icon = style.icon
  return (
    <Pill className={cn(style.badge, className)}>
      <Icon className="size-3" aria-hidden />
      {compact ? style.short : team}
    </Pill>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Pill className={PRIORITY_STYLES[priority]}>{priority}</Pill>
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return <Pill className={SENTIMENT_STYLES[sentiment].badge}>{sentiment}</Pill>
}

export function ResolutionBadge({ status }: { status: ResolutionStatus }) {
  return <Pill className={RESOLUTION_STYLES[status]}>{status}</Pill>
}

export function PageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
