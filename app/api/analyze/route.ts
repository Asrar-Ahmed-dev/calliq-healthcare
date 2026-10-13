import { generateObject } from 'ai'
import { normalizeAnalysis } from '@/lib/analysis-utils'
import { mockAnalyze } from '@/lib/mock-analyze'
import { analysisSchema } from '@/lib/schema'

export const maxDuration = 60

const MODEL = 'anthropic/claude-sonnet-5.5'

const SYSTEM_PROMPT = `You are a healthcare contact-center analyst. Read the call transcript and produce an accurate, concise structured analysis. Never invent facts not present in the transcript. If information is missing, leave the field empty. Mask IDs and phone numbers. Route every action to exactly one team using the routing rules provided.

ROUTING RULES (each action goes to exactly one team):
- Claim denied/pending/status → Claims & Adjudication
- Charges, refunds, EMI/payment issues → Billing & Payments
- Booking, rescheduling, cancellation → Appointment Scheduling
- Symptoms, discharge, care instructions, medical concerns → Clinical / Nursing Support
- Refills, drug availability, prescription issues → Pharmacy
- Angry caller, repeated complaint, service failure → Customer Grievance & Escalations
- Legal threats, regulator/ombudsman mention, privacy breach, fraud suspicion → Compliance & Legal
- Hospital network, doctor empanelment, provider disputes → Provider Relations

PRIORITY RULES:
- Critical if patient safety risk or regulator/legal mention
- High if angry caller or time-sensitive
- Otherwise Medium or Low
- dueInHours: Critical = 2, High = 24, Medium = 72, Low = 168

OUTPUT GUIDANCE:
- summary: 3-4 sentences.
- Mask IDs to the last 4 characters, e.g. "****4521". Mask phone numbers similarly.
- riskFlags: include potential complaint escalation, regulator/legal mentions, clinical-risk keywords, privacy issues, and any required disclosure the agent missed (e.g. appeal rights, reference number, identity/proxy verification).
- coachingNote: exactly one line of constructive feedback for the agent.
- Keep action titles short and imperative.`

export async function POST(req: Request) {
  let transcript: unknown
  try {
    ;({ transcript } = await req.json())
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof transcript !== 'string' || transcript.trim().length < 20) {
    return Response.json({ error: 'Transcript must be at least 20 characters.' }, { status: 400 })
  }
  if (transcript.length > 30000) {
    return Response.json({ error: 'Transcript is too long (max 30,000 characters).' }, { status: 413 })
  }

  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: analysisSchema,
      system: SYSTEM_PROMPT,
      prompt: `Call transcript:\n"""\n${transcript.trim()}\n"""`,
    })
    return Response.json({ analysis: normalizeAnalysis(object), source: 'ai' })
  } catch (error) {
    console.error('[calliq] AI analysis failed, using mock fallback:', error instanceof Error ? error.message : error)
    return Response.json({ analysis: normalizeAnalysis(mockAnalyze(transcript)), source: 'mock' })
  }
}
