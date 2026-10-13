import { SAMPLE_CALLS } from './samples'
import {
  DUE_HOURS_BY_PRIORITY,
  type Analysis,
  type AnalysisAction,
  type Category,
  type CallerType,
  type Priority,
  type Sentiment,
  type Team,
  type Urgency,
} from './schema'

const SAMPLE_ANALYSES: Record<string, Analysis> = {
  'claim-denial': {
    summary:
      'Member Robert Mendes called for the second time about a denied MRI claim ($2,340, Riverside Imaging, Sept 22) rejected for "prior authorization not on file." He states his physician submitted the authorization before the scan and that a promised callback from his previous contact on Oct 2 never happened. The agent agreed to submit a reconsideration, request the authorization record from Dr. Alvarez\'s office, and ask the provider to hold billing. The member remains frustrated and is concerned about collections.',
    category: 'Claim',
    callerType: 'Member',
    sentiment: 'Negative',
    urgency: 'High',
    resolutionStatus: 'Pending',
    entities: {
      name: 'Robert Mendes',
      memberId: 'BCH-7781-4521',
      claimNumber: 'CLM-2026-88213',
      amount: '$2,340',
      other: ['Provider: Riverside Imaging', 'Ordering physician: Dr. Alvarez', 'Date of service: Sept 22', 'Denial reason: prior auth not on file'],
    },
    patientRequests: [
      'Overturn the MRI claim denial',
      'Prevent the provider from sending the bill to collections',
      'Receive the promised callback this time',
    ],
    complaints: [
      'Claim denied despite authorization reportedly being submitted by the physician',
      'Promised callback from previous call (Oct 2) was never completed',
      'Had to call a second time about the same issue',
    ],
    agentCommitments: [
      { commitment: 'Submit claim reconsideration request', deadline: 'Today' },
      { commitment: 'Personal callback with update', deadline: 'Within 48 hours' },
      { commitment: 'Decision on reconsideration', deadline: 'Within 5 business days' },
      { commitment: 'Ask provider to hold billing during review' },
    ],
    actions: [
      { title: 'Submit reconsideration for denied MRI claim with prior-auth evidence', team: 'Claims & Adjudication', priority: 'High', dueInHours: 24, routingReason: 'Denied claim requiring reconsideration; time-sensitive for a frustrated repeat caller' },
      { title: 'Obtain prior authorization record from Dr. Alvarez\'s office', team: 'Provider Relations', priority: 'Medium', dueInHours: 72, routingReason: 'Requires coordination with in-network provider office for documentation' },
      { title: 'Request Riverside Imaging place a billing hold during claim review', team: 'Billing & Payments', priority: 'High', dueInHours: 24, routingReason: 'Member-facing charge at risk of collections referral' },
      { title: 'Log repeat contact and missed callback; ensure 48-hr callback is completed', team: 'Customer Grievance & Escalations', priority: 'High', dueInHours: 24, routingReason: 'Repeat complaint and prior service failure (missed callback)' },
    ],
    riskFlags: [
      'Repeat contact — prior commitment (callback) was not honored',
      'Collections risk on a claim under dispute',
      'Agent did not provide a reference number for the reconsideration',
      'Agent missed required appeal-rights disclosure for a denied claim',
    ],
    coachingNote:
      'Strong empathy and ownership — next time, read the member their appeal rights and give a reconsideration reference number before closing.',
  },
  'reschedule-refill': {
    summary:
      'Patient Maria Gonzalez called to reschedule her Oct 16 appointment with Dr. Chen and request a lisinopril 10 mg refill. The agent rebooked her for Oct 23 at 9:30 AM and cancelled the original slot. A refill request was sent to Dr. Chen\'s nurse team and marked urgent because she has about three days of medication left. The caller was satisfied with the outcome.',
    category: 'Appointment',
    callerType: 'Patient',
    sentiment: 'Positive',
    urgency: 'Medium',
    resolutionStatus: 'Pending',
    entities: {
      name: 'Maria Gonzalez',
      memberId: 'LMG-30958',
      appointmentDate: 'Oct 23, 9:30 AM (moved from Oct 16, 10 AM)',
      medication: 'Lisinopril 10 mg',
      other: ['Provider: Dr. Chen', 'Pharmacy: Walgreens, Elm Street', 'Supply remaining: ~3 days'],
    },
    patientRequests: ['Reschedule appointment to a morning the following week', 'Refill lisinopril 10 mg before supply runs out'],
    complaints: [],
    agentCommitments: [
      { commitment: 'Rebooked appointment for Oct 23 at 9:30 AM and cancelled Oct 16', deadline: 'Completed' },
      { commitment: 'Send urgent refill request to nurse team', deadline: '24–48 hours' },
      { commitment: 'Patient will receive a text when refill is sent to pharmacy' },
    ],
    actions: [
      { title: 'Send appointment confirmation for Oct 23, 9:30 AM with Dr. Chen', team: 'Appointment Scheduling', priority: 'Low', dueInHours: 168, routingReason: 'Rescheduling completed; confirmation only' },
      { title: 'Process urgent lisinopril 10 mg refill to Walgreens (Elm St)', team: 'Pharmacy', priority: 'High', dueInHours: 24, routingReason: 'Prescription refill; time-sensitive with ~3 days of supply left' },
    ],
    riskFlags: ['Medication supply gap risk — antihypertensive with ~3 days remaining'],
    coachingNote: 'Excellent, efficient call — consider confirming the best callback number for refill notifications.',
  },
  'billing-regulator': {
    summary:
      'Angela Brooks called about invoice INV-554219, billed $4,870 for an Aug 9 ER visit even though Meridian Health paid $3,200 on a $5,100 total. This is her third call, and the account has been referred to a collections agency while in dispute. She threatened to file a complaint with the state insurance commissioner and consult a lawyer if not fixed this week. The agent opened a billing dispute, placed a collections hold, and escalated to a supervisor and patient advocate.',
    category: 'Billing',
    callerType: 'Patient',
    sentiment: 'Angry',
    urgency: 'Critical',
    resolutionStatus: 'Escalation needed',
    entities: {
      name: 'Angela Brooks',
      claimNumber: 'INV-554219',
      amount: '$4,870 billed · $3,200 insurer paid · $5,100 total',
      other: ['Insurer: Meridian Health', 'Date of service: Aug 9 (ER)', 'Facility: Summit Regional Hospital'],
    },
    patientRequests: [
      'Correct the balance and apply the insurance payment',
      'Stop collections activity',
      'Corrected statement and a written apology',
      'Explanation of why account data went to collections during a dispute',
    ],
    complaints: [
      'Billed for amount already paid by insurance',
      'Third call about the same issue with no resolution',
      'Contacted by collections agency while account was in dispute',
    ],
    agentCommitments: [
      { commitment: 'Open billing dispute and place collections hold', deadline: 'Today' },
      { commitment: 'Supervisor callback', deadline: 'Within 24 hours' },
      { commitment: 'Corrected statement', deadline: 'Within 5 business days' },
      { commitment: 'Include collections data-sharing question in escalation' },
    ],
    actions: [
      { title: 'Review regulator/legal threat and collections referral during active dispute', team: 'Compliance & Legal', priority: 'Critical', dueInHours: 2, routingReason: 'Caller mentioned state insurance commissioner and a lawyer; possible improper data disclosure' },
      { title: 'Recall account from collections agency and confirm hold', team: 'Billing & Payments', priority: 'Critical', dueInHours: 2, routingReason: 'Active collections on disputed balance with legal exposure' },
      { title: 'Apply Meridian Health $3,200 payment and issue corrected statement', team: 'Billing & Payments', priority: 'High', dueInHours: 24, routingReason: 'Charge/payment posting error' },
      { title: 'Supervisor callback within 24 hrs and written apology', team: 'Customer Grievance & Escalations', priority: 'High', dueInHours: 24, routingReason: 'Angry caller, third repeat complaint, service failure' },
    ],
    riskFlags: [
      'Regulator mention — state insurance commissioner',
      'Legal threat — caller intends to consult a lawyer',
      'Potential privacy/FDCPA issue — account sent to collections while in dispute',
      'Repeat complaint (3rd contact) — high escalation risk',
    ],
    coachingNote:
      'Good de-escalation and clear timelines — provide a dispute reference number and the formal grievance process when a regulator is mentioned.',
  },
  'discharge-homecare': {
    summary:
      'David Kim, healthcare proxy for his father Henry Kim, called about a planned Oct 14 discharge following a fall. He asked who arranges the recommended home health nursing and physical therapy, whether a walker or hospital bed is covered, and how to manage warfarin dosing and INR testing. He reported new confusion in his father yesterday, which the agent agreed to relay to nursing before discharge. The case manager and discharge nurse are expected to call him.',
    category: 'Clinical query',
    callerType: 'Family',
    sentiment: 'Neutral',
    urgency: 'Critical',
    resolutionStatus: 'Pending',
    entities: {
      name: 'Henry Kim (patient) · David Kim (proxy)',
      memberId: 'MGH-882047',
      appointmentDate: 'Discharge planned Oct 14',
      medication: 'Warfarin',
      other: ['Admission reason: fall', 'Recommended: home health nursing + PT', 'Education preference: phone, after 5 PM'],
    },
    patientRequests: [
      'Arrange home health nursing and physical therapy',
      'Clarify DME needs (walker, hospital bed) and coverage',
      'Warfarin dosing and INR monitoring instructions by phone after 5 PM',
    ],
    complaints: [],
    agentCommitments: [
      { commitment: 'Notify nursing team of new confusion before discharge', deadline: 'Before discharge' },
      { commitment: 'Case manager to call about home care referral', deadline: 'Today' },
      { commitment: 'Discharge nurse to call with medication/INR education', deadline: 'Before discharge' },
    ],
    actions: [
      { title: 'Alert care team: new-onset confusion in anticoagulated fall patient before discharge', team: 'Clinical / Nursing Support', priority: 'Critical', dueInHours: 2, routingReason: 'Patient safety risk — new confusion, fall history, on warfarin' },
      { title: 'Case manager callback today to arrange home health nursing & PT referral', team: 'Clinical / Nursing Support', priority: 'High', dueInHours: 24, routingReason: 'Discharge planning and home-care arrangements; time-sensitive' },
      { title: 'Schedule phone discharge education on warfarin dosing & INR (after 5 PM)', team: 'Clinical / Nursing Support', priority: 'High', dueInHours: 24, routingReason: 'Care instructions for a high-risk medication before discharge' },
      { title: 'Verify DME coverage for walker / hospital bed', team: 'Claims & Adjudication', priority: 'Medium', dueInHours: 72, routingReason: 'Benefit coverage determination for durable medical equipment' },
    ],
    riskFlags: [
      'Clinical risk keywords: fall, new confusion, anticoagulant (warfarin)',
      'Potential unsafe discharge if confusion is not evaluated',
      'Proxy authorization accepted verbally — not verified against record',
    ],
    coachingNote:
      'Caring and clear — always verify healthcare proxy status against the patient record before discussing clinical details.',
  },
}

type Rule = { team: Team; pattern: RegExp; title: string; reason: string; category: Category }

const RULES: Rule[] = [
  { team: 'Compliance & Legal', pattern: /\b(lawyer|attorney|sue|lawsuit|legal action|regulator|ombudsman|commissioner|hipaa|privacy|breach|fraud)\b/i, title: 'Review legal/regulatory exposure from call', reason: 'Legal threat, regulator mention, privacy or fraud concern', category: 'Complaint' },
  { team: 'Claims & Adjudication', pattern: /\b(claim|denied|denial|adjudicat|eob|prior auth|authori[sz]ation)\b/i, title: 'Review claim status and determine next steps', reason: 'Claim denied, pending, or status inquiry', category: 'Claim' },
  { team: 'Billing & Payments', pattern: /\b(bill|billing|invoice|charge[ds]?|refund|payment|emi|balance|collections?)\b/i, title: 'Investigate charges and correct the account', reason: 'Charges, refunds, or payment issue', category: 'Billing' },
  { team: 'Appointment Scheduling', pattern: /\b(appointment|reschedul|cancel|book|slot|follow-up visit)\b/i, title: 'Book or reschedule appointment and send confirmation', reason: 'Booking, rescheduling, or cancellation request', category: 'Appointment' },
  { team: 'Clinical / Nursing Support', pattern: /\b(symptom|pain|fever|bleed|dizz|confus|discharge|wound|nurse|breath|chest|fall|care instructions)\b/i, title: 'Clinical callback to assess reported concern', reason: 'Symptoms, discharge, or care-instruction query', category: 'Clinical query' },
  { team: 'Pharmacy', pattern: /\b(refill|prescription|medication|pharmacy|drug|dose|dosage|mg)\b/i, title: 'Process prescription / refill request', reason: 'Refill, drug availability, or prescription issue', category: 'Pharmacy' },
  { team: 'Provider Relations', pattern: /\b(network|empanel|in-network|out-of-network|provider dispute|credential)\b/i, title: 'Follow up with provider on network/empanelment issue', reason: 'Hospital network, empanelment, or provider dispute', category: 'Other' },
]

const SAFETY = /\b(chest pain|can't breathe|cannot breathe|bleeding|suicid|overdose|confus|fall|stroke|unconscious)\b/i
const ANGRY = /\b(ridiculous|unacceptable|furious|harass|angry|third time|three times|again and again|fed up|worst)\b/i
const NEGATIVE = /\b(frustrat|upset|disappoint|not happy|second time|never called|still waiting|denied)\b/i
const POSITIVE = /\b(thank you so much|perfect|great|appreciate|helpful|wonderful)\b/i

function capture(text: string, re: RegExp): string | undefined {
  return text.match(re)?.[1]?.trim()
}

function heuristicAnalyze(transcript: string): Analysis {
  const callerLines = transcript
    .split('\n')
    .filter((l) => /^\s*(caller|patient|member|customer)\s*:/i.test(l))
    .map((l) => l.replace(/^[^:]+:\s*/, ''))
  const callerText = callerLines.join(' ') || transcript

  const safety = SAFETY.test(transcript)
  const legal = RULES[0].pattern.test(transcript)
  const angry = ANGRY.test(callerText)
  const sentiment: Sentiment = angry ? 'Angry' : NEGATIVE.test(callerText) ? 'Negative' : POSITIVE.test(callerText) ? 'Positive' : 'Neutral'

  const matched = RULES.filter((r) => r.pattern.test(transcript))
  const actions: AnalysisAction[] = matched.map((r) => {
    let priority: Priority = 'Medium'
    if ((r.team === 'Compliance & Legal' && legal) || (r.team === 'Clinical / Nursing Support' && safety)) priority = 'Critical'
    else if (angry || sentiment === 'Negative') priority = 'High'
    return { title: r.title, team: r.team, priority, dueInHours: DUE_HOURS_BY_PRIORITY[priority], routingReason: r.reason }
  })
  if (angry) {
    actions.push({
      title: 'Log complaint and arrange supervisor callback',
      team: 'Customer Grievance & Escalations',
      priority: 'High',
      dueInHours: 24,
      routingReason: 'Angry caller or repeated complaint',
    })
  }
  if (actions.length === 0) {
    actions.push({ title: 'Review call and follow up with caller', team: 'Customer Grievance & Escalations', priority: 'Low', dueInHours: 168, routingReason: 'No specific routing keyword detected; general follow-up' })
  }

  const urgency: Urgency = safety || legal ? 'Critical' : angry ? 'High' : actions.some((a) => a.priority === 'High') ? 'High' : 'Medium'
  const primary = matched.find((r) => r.team !== 'Compliance & Legal') ?? matched[0]
  const category: Category = angry && !primary ? 'Complaint' : primary?.category ?? 'Other'
  const callerType: CallerType = /\b(my (mother|father|mom|dad|son|daughter|wife|husband)|proxy)\b/i.test(callerText)
    ? 'Family'
    : /\b(dr\.|doctor's office|clinic calling|provider)\b/i.test(callerText.slice(0, 200))
      ? 'Provider'
      : /\bmember\b/i.test(transcript)
        ? 'Member'
        : 'Patient'

  const name = capture(transcript, /(?:my name is|this is|it's)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/)
  const memberId = capture(transcript, /\b(?:member|patient|policy)\s*(?:id|number|#)?\s*(?:is)?\s*([A-Z]{0,4}-?[\d-]{5,})/i) ?? capture(transcript, /\bMRN\s*(?:is)?\s*([A-Z]{0,4}-?\d{4,})/i)
  const claimNumber = capture(transcript, /\b(?:claim|invoice)\s*(?:number|#|no\.?)?\s*(?:is)?\s*([A-Z]{0,4}-?[\d-]{5,})/i)
  const amount = transcript.match(/\$[\d,]+(?:\.\d{2})?/g)?.slice(0, 3).join(' · ')
  const medication = capture(transcript, /\b(?:refill (?:on|for) (?:my )?|taking |on )([a-z]+(?:\s+\d+\s*(?:mg|milligrams))?)/i)
  const appointmentDate = capture(transcript, /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:\s+at\s+[\d:]+\s*[AP]M)?)/)

  const requests = callerLines
    .filter((l) => /\b(i need|i want|can you|could you|please|i'd like|i would like)\b/i.test(l))
    .slice(0, 4)
    .map((l) => l.replace(/\s+/g, ' ').slice(0, 140))
  const complaints = callerLines
    .filter((l) => ANGRY.test(l) || NEGATIVE.test(l))
    .slice(0, 3)
    .map((l) => l.replace(/\s+/g, ' ').slice(0, 140))
  const agentLines = transcript.split('\n').filter((l) => /^\s*agent\s*:/i.test(l))
  const commitments = agentLines
    .filter((l) => /\b(i will|i'll|we will|we'll|you'll receive|you will receive|within)\b/i.test(l))
    .slice(0, 4)
    .map((l) => {
      const text = l.replace(/^[^:]+:\s*/, '')
      const deadline = text.match(/within\s+[\w\s-]+?(hours?|days?|business days|hrs?)/i)?.[0]
      return { commitment: text.slice(0, 140), deadline }
    })

  const riskFlags: string[] = []
  if (legal) riskFlags.push('Legal / regulatory mention detected')
  if (safety) riskFlags.push('Clinical-risk keywords detected — review for patient safety')
  if (angry) riskFlags.push('Potential complaint escalation — angry or repeat caller')
  if (!/\b(reference|ticket|case) (number|#)\b/i.test(transcript)) riskFlags.push('Agent did not provide a reference number')

  const teams = [...new Set(actions.map((a) => a.team))].join(', ')
  const summary = `${name ?? 'The caller'} contacted the service center regarding a ${category.toLowerCase()} matter. ${
    requests[0] ? `Primary request: "${requests[0].slice(0, 100)}". ` : ''
  }The caller's sentiment was ${sentiment.toLowerCase()} and the call was assessed as ${urgency.toLowerCase()} urgency. Follow-up has been routed to ${teams}.`

  return {
    summary,
    category,
    callerType,
    sentiment,
    urgency,
    resolutionStatus: legal || angry ? 'Escalation needed' : 'Pending',
    entities: { name, memberId, claimNumber, appointmentDate, medication, amount, other: [] },
    patientRequests: requests,
    complaints,
    agentCommitments: commitments,
    actions,
    riskFlags,
    coachingNote: angry
      ? 'Acknowledge the repeat contact early and give a reference number with a firm callback time.'
      : 'Summarize next steps and provide a reference number before closing the call.',
  }
}

const normalizeText = (s: string) => s.replace(/\s+/g, ' ').trim()

export function mockAnalyze(transcript: string): Analysis {
  const input = normalizeText(transcript)
  const sample = SAMPLE_CALLS.find((s) => normalizeText(s.transcript) === input)
  if (sample) return structuredClone(SAMPLE_ANALYSES[sample.id])
  return heuristicAnalyze(transcript)
}
