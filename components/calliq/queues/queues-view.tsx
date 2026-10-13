'use client'

import { CheckCircle2, Circle, Inbox, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { ACTION_STATUSES, PRIORITIES, TEAMS, type ActionItem, type ActionStatus, type Team } from '@/lib/schema'
import { useStore } from '@/lib/store'
import { TEAM_STYLES } from '@/lib/teams'
import { cn } from '@/lib/utils'
import { PageHeader } from '../pills'
import { QueueCard } from './queue-card'

type GroupBy = 'team' | 'status'
type StatusFilter = ActionStatus | 'All'

const PRIORITY_RANK = Object.fromEntries(PRIORITIES.map((p, i) => [p, PRIORITIES.length - i])) as Record<string, number>
const STATUS_ICON = { 'To Do': Circle, 'In Progress': Loader, Done: CheckCircle2 } as const

function sortActions(list: ActionItem[]) {
  return [...list].sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || a.dueAt.localeCompare(b.dueAt))
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border bg-card p-1 shadow-xs">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            value === o.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function QueuesView() {
  const { actions, hydrated, updateAction, setActiveCallId } = useStore()
  const router = useRouter()
  const [groupBy, setGroupBy] = useState<GroupBy>('team')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<string | null>(null)

  const routed = actions.filter((a) => a.routed)
  const awaiting = actions.length - routed.length
  const visible = groupBy === 'team' && statusFilter !== 'All' ? routed.filter((a) => a.status === statusFilter) : routed

  const columns: { key: string; title: string; items: ActionItem[] }[] =
    groupBy === 'team'
      ? TEAMS.map((t) => ({ key: t, title: t, items: sortActions(visible.filter((a) => a.team === t)) }))
      : ACTION_STATUSES.map((s) => ({ key: s, title: s, items: sortActions(visible.filter((a) => a.status === s)) }))

  const drop = (columnKey: string, actionId: string) => {
    const action = actions.find((a) => a.id === actionId)
    if (!action) return
    if (groupBy === 'team') {
      if (action.team === columnKey) return
      updateAction(actionId, { team: columnKey as Team })
      toast.success(`Re-routed to ${columnKey}`, { description: action.title })
    } else {
      if (action.status === columnKey) return
      updateAction(actionId, { status: columnKey as ActionStatus })
      toast.success(`Moved to ${columnKey}`, { description: action.title })
    }
  }

  const changeStatus = (action: ActionItem, status: ActionStatus) => {
    updateAction(action.id, { status })
    toast.success(`Marked ${status}`, { description: action.title })
  }

  return (
    <>
      <PageHeader
        title="Team Queues"
        description={
          groupBy === 'team'
            ? 'Drag a card to another team to re-route it, or change its status from the dropdown.'
            : 'Drag cards between columns to update their status.'
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Segmented
          label="Group by"
          value={groupBy}
          onChange={setGroupBy}
          options={[
            { value: 'team', label: 'By team' },
            { value: 'status', label: 'By status' },
          ]}
        />
        {groupBy === 'team' && (
          <Segmented
            label="Status filter"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: 'All' as StatusFilter, label: 'All' }, ...ACTION_STATUSES.map((s) => ({ value: s as StatusFilter, label: s }))]}
          />
        )}
        <p className="text-xs text-muted-foreground sm:ml-auto">
          <span className="font-medium text-foreground tabular-nums">{routed.length}</span> routed
          {awaiting > 0 && (
            <>
              {' · '}
              <span className="font-medium text-amber-700 tabular-nums dark:text-amber-400">{awaiting}</span> awaiting approval
            </>
          )}
        </p>
      </div>

      {!hydrated ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 shrink-0 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-4">
            {columns.map((col) => {
              const teamStyle = groupBy === 'team' ? TEAM_STYLES[col.key as Team] : null
              const Icon = teamStyle?.icon ?? STATUS_ICON[col.key as ActionStatus]
              const isOver = overColumn === col.key && draggingId !== null
              return (
                <section
                  key={col.key}
                  aria-label={`${col.title} queue`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    if (overColumn !== col.key) setOverColumn(col.key)
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverColumn(null)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    drop(col.key, e.dataTransfer.getData('text/plain'))
                    setOverColumn(null)
                    setDraggingId(null)
                  }}
                  className={cn(
                    'flex max-h-[calc(100dvh-15rem)] min-h-80 w-72 shrink-0 flex-col rounded-2xl border bg-muted/40 transition-colors',
                    groupBy === 'status' && 'w-80 flex-1',
                    isOver && 'border-primary bg-accent/60 ring-2 ring-primary/20',
                  )}
                >
                  <header className="flex items-center gap-2 px-3.5 pt-3.5 pb-2.5">
                    <span className={cn('flex size-6 items-center justify-center rounded-lg', teamStyle ? teamStyle.badge : 'bg-card text-muted-foreground ring-1 ring-border')}>
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <h2 className="min-w-0 flex-1 truncate text-[13px] font-semibold">{col.title}</h2>
                    <span className="rounded-md bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums ring-1 ring-border">
                      {col.items.length}
                    </span>
                  </header>
                  <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 pb-2.5">
                    {col.items.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed py-10 text-center text-xs text-muted-foreground">
                        <Inbox className="size-5 opacity-60" aria-hidden />
                        {isOver ? 'Drop here' : 'Queue is clear'}
                      </div>
                    ) : (
                      col.items.map((a) => (
                        <QueueCard
                          key={a.id}
                          action={a}
                          showTeam={groupBy === 'status'}
                          dragging={draggingId === a.id}
                          onDragStart={setDraggingId}
                          onDragEnd={() => {
                            setDraggingId(null)
                            setOverColumn(null)
                          }}
                          onStatusChange={(s) => changeStatus(a, s)}
                          onOpenCall={() => {
                            setActiveCallId(a.callId)
                            router.push('/')
                          }}
                        />
                      ))
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
