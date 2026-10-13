'use client'

import { Copy, DatabaseZap, Printer, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatRelative, summaryToText } from '@/lib/analysis-utils'
import type { CallRecord } from '@/lib/schema'
import { ActionItemsCard } from './action-items-card'
import {
  CoachingCard,
  CommitmentsCard,
  ComplaintsCard,
  KeyDetailsCard,
  RequestsCard,
  RiskFlagsCard,
  SummaryCard,
} from './result-cards'

const SOURCE_LABEL: Record<CallRecord['source'], string> = {
  ai: 'AI analysis',
  mock: 'Demo engine',
  seed: 'Demo data',
}

export function AnalysisResults({ call }: { call: CallRecord }) {
  const { analysis } = call

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryToText(call.id, analysis))
      toast.success('Summary copied to clipboard')
    } catch {
      toast.error('Clipboard access was blocked by the browser')
    }
  }

  const pushToCrm = () => {
    const ticket = `CRM-${Math.floor(100000 + Math.random() * 900000)}`
    toast.success('Pushed to CRM', { description: `Ticket ${ticket} created for ${call.id}.` })
  }

  return (
    <div key={call.id} className="flex flex-col gap-4">
      <div className="animate-rise flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-semibold">{call.id}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
            <Sparkles className="size-3" aria-hidden />
            {SOURCE_LABEL[call.source]}
          </span>
          <span className="text-xs text-muted-foreground">{formatRelative(call.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={copySummary}>
            <Copy aria-hidden />
            Copy summary
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer aria-hidden />
            Export PDF
          </Button>
          <Button size="sm" onClick={pushToCrm}>
            <DatabaseZap aria-hidden />
            Push to CRM
          </Button>
        </div>
      </div>

      <SummaryCard analysis={analysis} />
      <KeyDetailsCard analysis={analysis} />
      <div className="grid gap-4 md:grid-cols-2">
        <RequestsCard analysis={analysis} />
        <ComplaintsCard analysis={analysis} />
      </div>
      <CommitmentsCard analysis={analysis} />
      <ActionItemsCard call={call} />
      <div className="grid gap-4 md:grid-cols-2">
        <RiskFlagsCard analysis={analysis} />
        <CoachingCard analysis={analysis} />
      </div>
    </div>
  )
}
