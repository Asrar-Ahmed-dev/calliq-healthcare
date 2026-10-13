import {
  Calendar,
  FileCheck2,
  HeartPulse,
  Megaphone,
  Pill,
  Receipt,
  Scale,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import type { Priority, ResolutionStatus, Sentiment, Team } from './schema'

type TeamStyle = {
  short: string
  icon: LucideIcon
  badge: string
  dot: string
  chart: string
}

export const TEAM_STYLES: Record<Team, TeamStyle> = {
  'Claims & Adjudication': {
    short: 'Claims',
    icon: FileCheck2,
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30',
    dot: 'bg-blue-500',
    chart: '#3b82f6',
  },
  'Billing & Payments': {
    short: 'Billing',
    icon: Receipt,
    badge: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30',
    dot: 'bg-amber-500',
    chart: '#f59e0b',
  },
  'Appointment Scheduling': {
    short: 'Scheduling',
    icon: Calendar,
    badge: 'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-400/30',
    dot: 'bg-teal-500',
    chart: '#14b8a6',
  },
  'Clinical / Nursing Support': {
    short: 'Clinical',
    icon: Stethoscope,
    badge: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30',
    dot: 'bg-rose-500',
    chart: '#f43f5e',
  },
  Pharmacy: {
    short: 'Pharmacy',
    icon: Pill,
    badge: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/30',
    dot: 'bg-violet-500',
    chart: '#8b5cf6',
  },
  'Customer Grievance & Escalations': {
    short: 'Grievance',
    icon: Megaphone,
    badge: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/30',
    dot: 'bg-orange-500',
    chart: '#f97316',
  },
  'Compliance & Legal': {
    short: 'Compliance',
    icon: Scale,
    badge: 'bg-slate-100 text-slate-800 ring-slate-600/20 dark:bg-slate-500/20 dark:text-slate-200 dark:ring-slate-400/30',
    dot: 'bg-slate-600',
    chart: '#475569',
  },
  'Provider Relations': {
    short: 'Providers',
    icon: HeartPulse,
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/30',
    dot: 'bg-indigo-500',
    chart: '#6366f1',
  },
}

export const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: 'bg-red-600 text-white ring-red-600 dark:bg-red-500',
  High: 'bg-orange-50 text-orange-700 ring-orange-600/25 dark:bg-orange-500/15 dark:text-orange-300',
  Medium: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300',
  Low: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300',
}

export const SENTIMENT_STYLES: Record<Sentiment, { badge: string; chart: string }> = {
  Positive: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300',
    chart: '#10b981',
  },
  Neutral: {
    badge: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300',
    chart: '#94a3b8',
  },
  Negative: {
    badge: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300',
    chart: '#f59e0b',
  },
  Angry: {
    badge: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300',
    chart: '#ef4444',
  },
}

export const RESOLUTION_STYLES: Record<ResolutionStatus, string> = {
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  Pending: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300',
  'Escalation needed': 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300',
}
