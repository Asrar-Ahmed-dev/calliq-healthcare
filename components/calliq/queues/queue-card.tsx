'use client'

import { CalendarClock, GripVertical } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDue } from '@/lib/analysis-utils'
import { ACTION_STATUSES, type ActionItem, type ActionStatus } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { PriorityBadge, TeamBadge } from '../pills'

const STATUS_DOT: Record<ActionStatus, string> = {
  'To Do': 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  Done: 'bg-emerald-500',
}

type Props = {
  action: ActionItem
  showTeam: boolean
  dragging: boolean
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onStatusChange: (status: ActionStatus) => void
  onOpenCall: () => void
}

export function QueueCard({ action, showTeam, dragging, onDragStart, onDragEnd, onStatusChange, onOpenCall }: Props) {
  const overdue = action.status !== 'Done' && new Date(action.dueAt).getTime() < Date.now()

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', action.id)
        onDragStart(action.id)
      }}
      onDragEnd={onDragEnd}
      className={cn(
        'group cursor-grab rounded-xl border bg-card p-3 shadow-xs transition-all hover:shadow-md active:cursor-grabbing',
        dragging && 'rotate-1 opacity-50',
        action.status === 'Done' && 'opacity-70',
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" aria-hidden />
        <p className={cn('flex-1 text-sm leading-snug font-medium', action.status === 'Done' && 'line-through decoration-muted-foreground/50')}>
          {action.title}
        </p>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={action.priority} />
        {showTeam && <TeamBadge team={action.team} compact />}
        <button
          type="button"
          onClick={onOpenCall}
          className="rounded font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
        >
          {action.callId}
        </button>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5">
        <span className={cn('inline-flex items-center gap-1 text-[11px]', overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
          <CalendarClock className="size-3" aria-hidden />
          {action.status === 'Done' ? 'Completed' : formatDue(action.dueAt)}
        </span>
        <Select value={action.status} onValueChange={(v) => v && onStatusChange(v as ActionStatus)}>
          <SelectTrigger size="sm" className="h-7 gap-1.5 px-2 text-xs" aria-label={`Status for ${action.title}`}>
            <span className={cn('size-1.5 rounded-full', STATUS_DOT[action.status])} aria-hidden />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </article>
  )
}
