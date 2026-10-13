'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildSeedData } from './seed'
import type { ActionItem, Analysis, AnalysisSource, CallRecord } from './schema'

const STORAGE_KEY = 'calliq:v1'

type State = { calls: CallRecord[]; actions: ActionItem[] }

type StoreValue = State & {
  hydrated: boolean
  activeCallId: string | null
  setActiveCallId: (id: string | null) => void
  addCall: (transcript: string, analysis: Analysis, source: AnalysisSource) => CallRecord
  routeAction: (id: string) => void
  routeAllForCall: (callId: string) => number
  updateAction: (id: string, patch: Partial<ActionItem>) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as State
      if (Array.isArray(parsed.calls) && Array.isArray(parsed.actions)) return parsed
    }
  } catch {
    // Corrupt storage falls through to fresh seed data.
  }
  return buildSeedData()
}

function nextCallId(calls: CallRecord[]): string {
  const max = calls.reduce((m, c) => Math.max(m, Number(c.id.replace(/\D/g, '')) || 0), 10400)
  return `CL-${max + 1}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ calls: [], actions: [] })
  const [hydrated, setHydrated] = useState(false)
  const [activeCallId, setActiveCallId] = useState<string | null>(null)

  useEffect(() => {
    setState(loadState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const addCall = useCallback(
    (transcript: string, analysis: Analysis, source: AnalysisSource) => {
      const id = nextCallId(state.calls)
      const now = Date.now()
      const record: CallRecord = { id, createdAt: new Date(now).toISOString(), transcript, analysis, source }
      const newActions: ActionItem[] = analysis.actions.map((a, i) => ({
        id: `${id}-A${i + 1}`,
        callId: id,
        title: a.title,
        team: a.team,
        priority: a.priority,
        routingReason: a.routingReason,
        dueAt: new Date(now + a.dueInHours * 36e5).toISOString(),
        routed: false,
        status: 'To Do',
      }))
      setState((prev) => ({ calls: [record, ...prev.calls], actions: [...newActions, ...prev.actions] }))
      return record
    },
    [state.calls],
  )

  const updateAction = useCallback((id: string, patch: Partial<ActionItem>) => {
    setState((prev) => ({ ...prev, actions: prev.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)) }))
  }, [])

  const routeAction = useCallback((id: string) => updateAction(id, { routed: true, status: 'To Do' }), [updateAction])

  const routeAllForCall = useCallback(
    (callId: string) => {
      const count = state.actions.filter((a) => a.callId === callId && !a.routed).length
      setState((prev) => ({
        ...prev,
        actions: prev.actions.map((a) => (a.callId === callId && !a.routed ? { ...a, routed: true, status: 'To Do' } : a)),
      }))
      return count
    },
    [state.actions],
  )

  const resetDemo = useCallback(() => {
    setState(buildSeedData())
    setActiveCallId(null)
  }, [])

  const value = useMemo<StoreValue>(
    () => ({ ...state, hydrated, activeCallId, setActiveCallId, addCall, routeAction, routeAllForCall, updateAction, resetDemo }),
    [state, hydrated, activeCallId, addCall, routeAction, routeAllForCall, updateAction, resetDemo],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
