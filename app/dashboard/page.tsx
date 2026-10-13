import type { Metadata } from 'next'
import { DashboardView } from '@/components/calliq/dashboard/dashboard-view'

export const metadata: Metadata = { title: 'Dashboard · CallIQ' }

export default function Page() {
  return <DashboardView />
}
