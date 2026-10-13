import { z } from 'zod'

export const TEAMS = [
  'Claims & Adjudication',
  'Billing & Payments',
  'Appointment Scheduling',
  'Clinical / Nursing Support',
  'Pharmacy',
  'Customer Grievance & Escalations',
  'Compliance & Legal',
  'Provider Relations',
] as const

export const CATEGORIES = [
  'Claim',
  'Appointment',
  'Billing',
  'Clinical query',
  'Complaint',
  'Pharmacy',
  'Other',
] as const

export const CALLER_TYPES = ['Patient', 'Family', 'Provider', 'Member'] as const
export const SENTIMENTS = ['Positive', 'Neutral', 'Negative', 'Angry'] as const
export const URGENCIES = ['Low', 'Medium', 'High', 'Critical'] as const
export const PRIORITIES = URGENCIES
export const RESOLUTION_STATUSES = ['Resolved', 'Pending', 'Escalation needed'] as const

export type Team = (typeof TEAMS)[number]
export type Category = (typeof CATEGORIES)[number]
export type CallerType = (typeof CALLER_TYPES)[number]
export type Sentiment = (typeof SENTIMENTS)[number]
export type Urgency = (typeof URGENCIES)[number]
export type Priority = Urgency
export type ResolutionStatus = (typeof RESOLUTION_STATUSES)[number]

export const DUE_HOURS_BY_PRIORITY: Record<Priority, number> = {
  Critical: 2,
  High: 24,
  Medium: 72,
  Low: 168,
}

export const analysisSchema = z.object({
  summary: z.string().describe('3-4 sentence neutral summary of the call'),
  category: z.enum(CATEGORIES),
  callerType: z.enum(CALLER_TYPES),
  sentiment: z.enum(SENTIMENTS),
  urgency: z.enum(URGENCIES),
  resolutionStatus: z.enum(RESOLUTION_STATUSES),
  entities: z.object({
    name: z.string().optional().describe('Patient or member name'),
    memberId: z.string().optional().describe('Member, patient, policy or MRN ID, masked e.g. ****4521'),
    claimNumber: z.string().optional().describe('Claim or invoice number, masked e.g. ****8213'),
    appointmentDate: z.string().optional(),
    medication: z.string().optional(),
    amount: z.string().optional().describe('Monetary amount(s) mentioned'),
    other: z.array(z.string()).optional().describe('Other relevant details, e.g. "Provider: Dr. Chen"'),
  }),
  patientRequests: z.array(z.string()),
  complaints: z.array(z.string()),
  agentCommitments: z.array(
    z.object({
      commitment: z.string(),
      deadline: z.string().optional(),
    }),
  ),
  actions: z.array(
    z.object({
      title: z.string(),
      team: z.enum(TEAMS),
      priority: z.enum(PRIORITIES),
      dueInHours: z.number(),
      routingReason: z.string(),
    }),
  ),
  riskFlags: z.array(z.string()),
  coachingNote: z.string(),
})

export type Analysis = z.infer<typeof analysisSchema>
export type AnalysisAction = Analysis['actions'][number]

export type AnalysisSource = 'ai' | 'mock' | 'seed'

export type CallRecord = {
  id: string
  createdAt: string
  transcript: string
  analysis: Analysis
  source: AnalysisSource
}

export const ACTION_STATUSES = ['To Do', 'In Progress', 'Done'] as const
export type ActionStatus = (typeof ACTION_STATUSES)[number]

export type ActionItem = {
  id: string
  callId: string
  title: string
  team: Team
  priority: Priority
  dueAt: string
  routingReason: string
  routed: boolean
  status: ActionStatus
}
