'use client'

import { History } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Analysis, AnalysisSource } from '@/lib/schema'
import { useStore } from '@/lib/store'
import { PageHeader } from '../pills'
import { AnalysisResults } from './analysis-results'
import { ResultsEmpty, ResultsSkeleton } from './result-states'
import { TranscriptInput } from './transcript-input'

type AnalyzeResponse = { analysis: Analysis; source: AnalysisSource } | { error: string }

export function AnalyzeView() {
  const { calls, activeCallId, setActiveCallId, addCall, hydrated } = useStore()
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const activeCall = calls.find((c) => c.id === activeCallId) ?? null

  const syncedCallRef = useRef<string | null>(null)
  useEffect(() => {
    if (activeCall && syncedCallRef.current !== activeCall.id) {
      syncedCallRef.current = activeCall.id
      setTranscript(activeCall.transcript)
    }
  }, [activeCall])

  const analyze = async () => {
    setLoading(true)
    if (window.innerWidth < 1280) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      const data = (await res.json()) as AnalyzeResponse
      if (!res.ok || 'error' in data) throw new Error('error' in data ? data.error : 'Analysis failed')
      const record = addCall(transcript, data.analysis, data.source)
      syncedCallRef.current = record.id
      setActiveCallId(record.id)
      const n = data.analysis.actions.length
      toast.success(`Call ${record.id} analyzed`, {
        description: `${n} action${n === 1 ? '' : 's'} ready to route${data.source === 'mock' ? ' · demo engine (AI unavailable)' : ''}.`,
      })
    } catch (err) {
      toast.error('Could not analyze call', { description: err instanceof Error ? err.message : 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Analyze Call"
        description="Convert a raw call conversation into a structured summary with auto-routed action items."
      >
        {activeCall && !loading && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveCallId(null)
              syncedCallRef.current = null
              setTranscript('')
            }}
          >
            <History aria-hidden />
            New analysis
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[minmax(380px,5fr)_minmax(0,7fr)]">
        <div className="xl:sticky xl:top-8 xl:self-start">
          <TranscriptInput value={transcript} onChange={setTranscript} onAnalyze={analyze} loading={loading} />
        </div>
        <div ref={resultsRef} className="scroll-mt-32 min-w-0">
          {loading ? (
            <ResultsSkeleton />
          ) : activeCall ? (
            <AnalysisResults call={activeCall} />
          ) : hydrated ? (
            <ResultsEmpty />
          ) : null}
        </div>
      </div>
    </>
  )
}
