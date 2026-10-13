'use client'

import { AudioLines, KanbanSquare, LayoutDashboard, Moon, RotateCcw, ShieldCheck, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Analyze Call', icon: AudioLines },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/queues', label: 'Team Queues', icon: KanbanSquare },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="CallIQ home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <AudioLines className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-semibold tracking-tight">CallIQ</span>
        <span className="text-[11px] text-muted-foreground">Call intelligence</span>
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </Button>
  )
}

function useOpenActionCount() {
  const { actions } = useStore()
  return actions.filter((a) => a.routed && a.status !== 'Done').length
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { resetDemo, hydrated } = useStore()
  const openCount = useOpenActionCount()

  const handleReset = () => {
    resetDemo()
    toast.success('Demo data reset', { description: 'Restored 15 synthetic calls.' })
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex print:hidden">
        <Logo />
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
                {item.href === '/queues' && hydrated && openCount > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                    {openCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-2xl border bg-accent/50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-foreground">
              <ShieldCheck className="size-4" aria-hidden />
              HIPAA-ready architecture
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              IDs are masked before storage. Demo uses synthetic data only.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="size-3.5" aria-hidden />
              Reset demo
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-col gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur lg:hidden print:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </div>
          <nav aria-label="Main" className="-mx-1 flex gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium',
                    active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>

        <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-10 print:hidden">
          Demo uses synthetic data. Not for real PHI. HIPAA-ready architecture.
        </footer>
      </div>
    </div>
  )
}
