import { FileText, ListChecks, ShieldAlert, Sparkles, Tag } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const STEPS = ['Reading transcript', 'Extracting entities & masking PHI', 'Detecting risk & sentiment', 'Routing actions to teams']

export function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4 animate-pulse" aria-hidden />
          Analyzing call…
        </div>
        <ol className="grid gap-2 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="animate-rise flex items-center gap-2 text-xs text-muted-foreground"
              style={{ animationDelay: `${i * 450}ms` }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
              {step}
            </li>
          ))}
        </ol>
      </div>
      {[FileText, Tag, ListChecks].map((Icon, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResultsEmpty() {
  const features = [
    { icon: FileText, label: 'Structured summary & metadata' },
    { icon: Tag, label: 'Entity extraction with PHI masking' },
    { icon: ListChecks, label: 'Actions auto-routed to 8 teams' },
    { icon: ShieldAlert, label: 'Compliance & risk flags' },
  ]
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-4 rounded-full bg-primary/10 blur-xl" aria-hidden />
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Sparkles className="size-7" aria-hidden />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-balance">Your call analysis will appear here</h2>
      <p className="mt-1.5 max-w-sm text-sm text-pretty text-muted-foreground">
        Paste a transcript or load one of the sample calls, then click{' '}
        <span className="font-medium text-foreground">Analyze Call</span>.
      </p>
      <ul className="mt-6 grid w-full max-w-md gap-2 text-left sm:grid-cols-2">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-xs">
            <f.icon className="size-4 shrink-0 text-primary" aria-hidden />
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
