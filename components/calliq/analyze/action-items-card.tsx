'use client'

import { CheckCircle2, ListChecks, Pencil, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatDue } from '@/lib/analysis-utils'
import type { ActionItem, CallRecord } from '@/lib/schema'
import { useStore } from '@/lib/store'
import { EditActionDialog } from '../edit-action-dialog'
import { PriorityBadge, TeamBadge } from '../pills'
import { SectionCard } from './result-cards'

function RowActions({ action, onEdit }: { action: ActionItem; onEdit: () => void }) {
  const { routeAction } = useStore()
  if (action.routed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" aria-hidden />
        Routed
      </span>
    )
  }
  return (
    <div className="flex items-center gap-1.5 print:hidden">
      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit action: ${action.title}`}>
        <Pencil />
      </Button>
      <Button
        size="sm"
        onClick={() => {
          routeAction(action.id)
          toast.success(`Routed to ${action.team}`, { description: action.title })
        }}
      >
        <Send aria-hidden />
        Approve &amp; Route
      </Button>
    </div>
  )
}

export function ActionItemsCard({ call }: { call: CallRecord }) {
  const { actions, routeAllForCall, updateAction } = useStore()
  const [editing, setEditing] = useState<ActionItem | null>(null)
  const callActions = actions.filter((a) => a.callId === call.id)
  const pending = callActions.filter((a) => !a.routed).length

  const routeAll = () => {
    const count = routeAllForCall(call.id)
    toast.success(`Routed ${count} action${count === 1 ? '' : 's'}`, {
      description: 'Tasks are now visible in Team Queues.',
    })
  }

  return (
    <SectionCard
      title="Action Items"
      icon={ListChecks}
      delay={220}
      className="@container"
      action={
        pending > 0 ? (
          <Button size="sm" variant="outline" onClick={routeAll} className="print:hidden">
            <Send aria-hidden />
            Route All ({pending})
          </Button>
        ) : callActions.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" aria-hidden />
            All routed
          </span>
        ) : null
      }
    >
      {callActions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No follow-up actions required.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 @3xl:hidden">
            {callActions.map((a) => (
              <li key={a.id} className="rounded-xl border bg-muted/30 p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <TeamBadge team={a.team} />
                  <PriorityBadge priority={a.priority} />
                </div>
                <p className="mt-2 text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.routingReason}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Due {formatDue(a.dueAt)}</span>
                  <RowActions action={a} onEdit={() => setEditing(a)} />
                </div>
              </li>
            ))}
          </ul>

          <div className="-mx-5 hidden overflow-x-auto @3xl:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y bg-muted/40 text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 font-medium">Action</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Assigned Team</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Priority</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Due</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Reason for routing</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {callActions.map((a) => (
                  <tr key={a.id} className="align-top transition-colors hover:bg-muted/30">
                    <td className="max-w-56 px-5 py-3 font-medium">{a.title}</td>
                    <td className="px-3 py-3">
                      <TeamBadge team={a.team} compact />
                    </td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={a.priority} />
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-muted-foreground">{formatDue(a.dueAt)}</td>
                    <td className="max-w-60 px-3 py-3 text-xs leading-relaxed text-muted-foreground">{a.routingReason}</td>
                    <td className="px-5 py-3 text-right">
                      <RowActions action={a} onEdit={() => setEditing(a)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <EditActionDialog
        action={editing}
        callCreatedAt={call.createdAt}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={(patch) => {
          if (!editing) return
          updateAction(editing.id, patch)
          toast.success('Action updated', { description: patch.team ? `Assigned to ${patch.team}` : undefined })
          setEditing(null)
        }}
      />
    </SectionCard>
  )
}
