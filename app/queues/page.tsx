import type { Metadata } from 'next'
import { QueuesView } from '@/components/calliq/queues/queues-view'

export const metadata: Metadata = { title: 'Team Queues · CallIQ' }

export default function Page() {
  return <QueuesView />
}
