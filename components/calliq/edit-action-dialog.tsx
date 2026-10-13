'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DUE_HOURS_BY_PRIORITY, PRIORITIES, TEAMS, type ActionItem, type Priority, type Team } from '@/lib/schema'

type Props = {
  action: ActionItem | null
  callCreatedAt?: string
  onOpenChange: (open: boolean) => void
  onSave: (patch: Partial<ActionItem>) => void
}

export function EditActionDialog({ action, callCreatedAt, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={action !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {action && <EditForm key={action.id} action={action} callCreatedAt={callCreatedAt} onSave={onSave} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function EditForm({
  action,
  callCreatedAt,
  onSave,
  onCancel,
}: {
  action: ActionItem
  callCreatedAt?: string
  onSave: (patch: Partial<ActionItem>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(action.title)
  const [team, setTeam] = useState<Team>(action.team)
  const [priority, setPriority] = useState<Priority>(action.priority)
  const [reason, setReason] = useState(action.routingReason)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const base = callCreatedAt ? new Date(callCreatedAt).getTime() : Date.now()
    onSave({
      title: title.trim(),
      team,
      priority,
      routingReason: reason.trim(),
      dueAt: priority !== action.priority ? new Date(base + DUE_HOURS_BY_PRIORITY[priority] * 36e5).toISOString() : action.dueAt,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Edit action</DialogTitle>
        <DialogDescription>Override the AI routing before approving. Changing priority recalculates the due date.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label htmlFor="action-title">Action</Label>
        <Input id="action-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Assigned team</Label>
          <Select value={team} onValueChange={(v) => v && setTeam(v as Team)}>
            <SelectTrigger className="w-full" aria-label="Assigned team">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => v && setPriority(v as Priority)}>
            <SelectTrigger className="w-full" aria-label="Priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="action-reason">Reason for routing</Label>
        <Textarea id="action-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
