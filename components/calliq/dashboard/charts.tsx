'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReactNode } from 'react'
import { CATEGORIES, SENTIMENTS, TEAMS, type ActionItem, type CallRecord } from '@/lib/schema'
import { SENTIMENT_STYLES, TEAM_STYLES } from '@/lib/teams'

const AXIS = { fontSize: 11, fill: 'var(--muted-foreground)' }
const TOOLTIP_PROPS = {
  cursor: { fill: 'var(--muted)', opacity: 0.6 },
  contentStyle: {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    fontSize: 12,
    color: 'var(--popover-foreground)',
    boxShadow: '0 4px 16px rgb(0 0 0 / 0.08)',
  },
  labelStyle: { color: 'var(--foreground)', fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: 'var(--popover-foreground)' },
}

export function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      <div className="h-64">{children}</div>
    </section>
  )
}

export function CategoryChart({ calls }: { calls: CallRecord[] }) {
  const data = CATEGORIES.map((c) => ({
    name: c === 'Clinical query' ? 'Clinical' : c,
    calls: calls.filter((x) => x.analysis.category === c).length,
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="name" tick={AXIS} tickLine={false} axisLine={false} interval={0} />
        <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <Tooltip {...TOOLTIP_PROPS} />
        <Bar dataKey="calls" name="Calls" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SentimentChart({ calls }: { calls: CallRecord[] }) {
  const data = SENTIMENTS.map((s) => ({
    name: s,
    value: calls.filter((x) => x.analysis.sentiment === s).length,
    fill: SENTIMENT_STYLES[s].chart,
  })).filter((d) => d.value > 0)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="var(--card)" strokeWidth={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip {...TOOLTIP_PROPS} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function TeamChart({ actions }: { actions: ActionItem[] }) {
  const data = TEAMS.map((t) => ({
    name: TEAM_STYLES[t].short,
    team: t,
    actions: actions.filter((a) => a.team === t).length,
    fill: TEAM_STYLES[t].chart,
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={AXIS} tickLine={false} axisLine={false} width={78} />
        <Tooltip {...TOOLTIP_PROPS} labelFormatter={(_, p) => p?.[0]?.payload?.team ?? ''} />
        <Bar dataKey="actions" name="Actions" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {data.map((d) => (
            <Cell key={d.team} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function UrgencyTrendChart({ calls }: { calls: CallRecord[] }) {
  const days = 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const data = Array.from({ length: days }, (_, i) => {
    const start = new Date(today.getTime() - (days - 1 - i) * 864e5)
    const end = start.getTime() + 864e5
    const inDay = calls.filter((c) => {
      const t = new Date(c.createdAt).getTime()
      return t >= start.getTime() && t < end
    })
    const count = (levels: string[]) => inDay.filter((c) => levels.includes(c.analysis.urgency)).length
    return {
      day: start.toLocaleDateString(undefined, { weekday: 'short' }),
      'Critical/High': count(['Critical', 'High']),
      'Medium/Low': count(['Medium', 'Low']),
    }
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <Tooltip {...TOOLTIP_PROPS} cursor={{ stroke: 'var(--border)' }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Critical/High" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="Medium/Low" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
