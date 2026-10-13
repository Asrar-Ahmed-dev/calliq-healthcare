'use client'

import { AlertOctagon, ChevronRight, Clock, ListTodo, PhoneCall, RotateCcw, type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/analysis-utils'
import { useStore } from '@/lib/store'
import { PageHeader, ResolutionBadge, SentimentBadge } from '../pills'
import { CategoryChart, ChartCard, SentimentChart, TeamChart, UrgencyTrendChart } from './charts'

const MINUTES_SAVED_PER_CALL = 6

function KpiCard({ label, value, hint, icon: Icon, tone }: { label: string; value: string; hint: string; icon: LucideIcon; tone: string }) {
  return (
    <div className="animate-rise rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={`flex size-9 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function DashboardView() {
  const { calls, actions, hydrated, setActiveCallId, resetDemo } = useStore()
  const router = useRouter()

  const openActions = actions.filter((a) => a.status !== 'Done').length
  const escalations = calls.filter(
    (c) => c.analysis.resolutionStatus === 'Escalation needed' || c.analysis.urgency === 'Critical',
  ).length
  const hoursSaved = (calls.length * MINUTES_SAVED_PER_CALL) / 60
  const recent = [...calls].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8)

  const reopen = (id: string) => {
    setActiveCallId(id)
    router.push('/')
  }

  return (
    <>
      <PageHeader title="Dashboard" description="Contact-center intelligence across every analyzed call.">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetDemo()
            toast.success('Demo data reset')
          }}
        >
          <RotateCcw aria-hidden />
          Reset demo data
        </Button>
      </PageHeader>

      {!hydrated ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Calls analyzed"
              value={calls.length.toString()}
              hint="Across all channels"
              icon={PhoneCall}
              tone="bg-accent text-accent-foreground"
            />
            <KpiCard
              label="Avg. time saved / call"
              value={`${MINUTES_SAVED_PER_CALL} min`}
              hint={`${hoursSaved.toFixed(1)} agent-hours saved total`}
              icon={Clock}
              tone="bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
            />
            <KpiCard
              label="Open actions"
              value={openActions.toString()}
              hint={`${actions.length - openActions} completed`}
              icon={ListTodo}
              tone="bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            />
            <KpiCard
              label="Escalations"
              value={escalations.toString()}
              hint="Critical or escalation-needed calls"
              icon={AlertOctagon}
              tone="bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Calls by category" description="Primary reason for each call">
              <CategoryChart calls={calls} />
            </ChartCard>
            <ChartCard title="Sentiment distribution" description="Caller sentiment at end of call">
              <SentimentChart calls={calls} />
            </ChartCard>
            <ChartCard title="Actions by team" description="Where follow-up work is being routed">
              <TeamChart actions={actions} />
            </ChartCard>
            <ChartCard title="Urgency trend" description="Daily call volume by urgency, last 7 days">
              <UrgencyTrendChart calls={calls} />
            </ChartCard>
          </div>

          <section className="rounded-2xl border bg-card shadow-sm" aria-labelledby="recent-heading">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 id="recent-heading" className="text-sm font-semibold">
                  Recent calls
                </h2>
                <p className="text-xs text-muted-foreground">Click a call to reopen its analysis</p>
              </div>
            </div>
            {recent.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">No calls analyzed yet.</p>
            ) : (
              <ul className="divide-y">
                {recent.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => reopen(c.id)}
                      className="group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold">{c.id}</span>
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium">{c.analysis.category}</span>
                          <span className="text-xs text-muted-foreground">{formatRelative(c.createdAt)}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{c.analysis.summary}</p>
                      </div>
                      <div className="hidden shrink-0 items-center gap-2 sm:flex">
                        <SentimentBadge sentiment={c.analysis.sentiment} />
                        <ResolutionBadge status={c.analysis.resolutionStatus} />
                      </div>
                      <ChevronRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  )
}
