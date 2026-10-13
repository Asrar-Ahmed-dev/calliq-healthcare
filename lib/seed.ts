import { normalizeAnalysis } from './analysis-utils'
import {
  DUE_HOURS_BY_PRIORITY,
  type ActionItem,
  type ActionStatus,
  type Analysis,
  type CallRecord,
  type Priority,
  type Team,
} from './schema'

type SeedAction = [title: string, team: Team, priority: Priority, reason: string, status: ActionStatus | 'Unrouted']

type SeedCall = {
  hoursAgo: number
  transcript: string
  analysis: Omit<Analysis, 'actions' | 'patientRequests' | 'complaints' | 'agentCommitments'> &
    Partial<Pick<Analysis, 'patientRequests' | 'complaints' | 'agentCommitments'>>
  actions: SeedAction[]
}

const SEEDS: SeedCall[] = [
  {
    hoursAgo: 3,
    transcript: 'Agent: Member services, this is Tom.\nCaller: Hi, I want to know the status of my knee surgery claim CLM-2026-77120. It has been pending for 30 days.\nAgent: I see it is pending medical review. I will request an expedited review and call you within 3 days.',
    analysis: { summary: 'Member James Porter called about a knee surgery claim pending for 30 days. The claim is in medical review. The agent requested an expedited review and committed to a callback within 3 days.', category: 'Claim', callerType: 'Member', sentiment: 'Neutral', urgency: 'Medium', resolutionStatus: 'Pending', entities: { name: 'James Porter', claimNumber: 'CLM-2026-77120' }, riskFlags: [], coachingNote: 'Clear status update — confirm the member\'s callback number.' , agentCommitments: [{ commitment: 'Request expedited review and call back', deadline: 'Within 3 days' }] },
    actions: [['Expedite medical review on pending knee surgery claim', 'Claims & Adjudication', 'Medium', 'Claim pending status inquiry', 'In Progress']],
  },
  {
    hoursAgo: 6,
    transcript: 'Agent: Pharmacy line, this is Ana.\nCaller: My insulin pens are out of stock at my pharmacy and I only have one day left.\nAgent: I will check alternate pharmacies and have a pharmacist call you within 2 hours.',
    analysis: { summary: 'Patient Leila Hassan reported her insulin pens are out of stock with only one day of supply left. The agent committed to locating stock at an alternate pharmacy with a pharmacist callback within 2 hours.', category: 'Pharmacy', callerType: 'Patient', sentiment: 'Negative', urgency: 'Critical', resolutionStatus: 'Pending', entities: { name: 'Leila Hassan', medication: 'Insulin glargine pens' }, riskFlags: ['Patient safety — insulin supply gap within 24 hours'], coachingNote: 'Good urgency — also advise the patient on what to do if they run out tonight.' },
    actions: [['Locate insulin stock at alternate pharmacy and transfer Rx', 'Pharmacy', 'Critical', 'Drug availability issue with patient safety risk', 'In Progress']],
  },
  {
    hoursAgo: 9,
    transcript: 'Agent: Scheduling, this is Mark.\nCaller: I need to cancel my MRI on Friday and rebook for next week.\nAgent: Done, you are now booked Tuesday at 8 AM.',
    analysis: { summary: 'Patient Sofia Rossi cancelled her Friday MRI and was rebooked for Tuesday at 8 AM. The call was resolved on first contact.', category: 'Appointment', callerType: 'Patient', sentiment: 'Positive', urgency: 'Low', resolutionStatus: 'Resolved', entities: { name: 'Sofia Rossi', appointmentDate: 'Tuesday, 8:00 AM' }, riskFlags: [], coachingNote: 'Efficient first-contact resolution.' },
    actions: [['Send MRI prep instructions for rebooked Tuesday slot', 'Appointment Scheduling', 'Low', 'Rescheduling confirmation', 'Done']],
  },
  {
    hoursAgo: 14,
    transcript: 'Agent: Billing, this is Rae.\nCaller: I was charged twice for my copay, $45 each. I want a refund.\nAgent: I see the duplicate. I will process a refund within 7 business days.',
    analysis: { summary: 'Patient Omar Khalid reported a duplicate $45 copay charge. The agent confirmed the duplicate and initiated a refund expected within 7 business days.', category: 'Billing', callerType: 'Patient', sentiment: 'Neutral', urgency: 'Low', resolutionStatus: 'Resolved', entities: { name: 'Omar Khalid', amount: '$45 (duplicate)' }, riskFlags: [], coachingNote: 'Provide a refund reference number.' },
    actions: [['Refund duplicate $45 copay', 'Billing & Payments', 'Low', 'Refund for duplicate charge', 'To Do']],
  },
  {
    hoursAgo: 20,
    transcript: 'Agent: Patient support.\nCaller: This is ridiculous, my mother waited 5 hours in the ER and nobody told us anything. This is the third time I am calling!\nAgent: I am very sorry. I will file a formal grievance and a supervisor will call you within 24 hours.',
    analysis: { summary: 'Family member Grace Liu complained about a 5-hour ER wait without communication for her mother. It was her third call. The agent filed a formal grievance with a supervisor callback promised within 24 hours.', category: 'Complaint', callerType: 'Family', sentiment: 'Angry', urgency: 'High', resolutionStatus: 'Escalation needed', entities: { name: 'Grace Liu' }, riskFlags: ['Repeat complaint (3rd contact)', 'Potential complaint escalation'], coachingNote: 'Acknowledge prior contacts at the start of the call.' },
    actions: [['File formal grievance and supervisor callback re: ER wait', 'Customer Grievance & Escalations', 'High', 'Angry, repeat caller; service failure', 'To Do']],
  },
  {
    hoursAgo: 28,
    transcript: 'Agent: Provider services.\nCaller: This is Dr. Patel\'s office. Our empanelment application has been stuck for 6 weeks and claims are being paid out-of-network.\nAgent: I will escalate to the network team for a status update within 3 days.',
    analysis: { summary: 'Dr. Patel\'s office reported a 6-week delay on their network empanelment, causing claims to process out-of-network. The agent escalated to the network team.', category: 'Other', callerType: 'Provider', sentiment: 'Negative', urgency: 'Medium', resolutionStatus: 'Pending', entities: { name: 'Dr. Anil Patel (provider)' }, riskFlags: ['Member claims impacted by provider network status'], coachingNote: 'Capture the application ID for faster tracking.' },
    actions: [
      ['Escalate stalled empanelment application for Dr. Patel', 'Provider Relations', 'Medium', 'Doctor empanelment issue', 'In Progress'],
      ['Review out-of-network claims pending empanelment', 'Claims & Adjudication', 'Medium', 'Claims adjudicated at wrong network tier', 'To Do'],
    ],
  },
  {
    hoursAgo: 34,
    transcript: 'Agent: Nurse line.\nCaller: My son had his tonsils out and he is running a fever of 102 and there is some bleeding.\nAgent: Post-op bleeding needs immediate attention. Please go to the ER now. I will notify the on-call surgeon.',
    analysis: { summary: 'A parent reported post-tonsillectomy fever of 102°F and bleeding in their son. The agent advised immediate ER evaluation and notified the on-call surgeon.', category: 'Clinical query', callerType: 'Family', sentiment: 'Negative', urgency: 'Critical', resolutionStatus: 'Escalation needed', entities: { name: 'Ethan Brooks (patient)', other: ['Procedure: tonsillectomy'] }, riskFlags: ['Clinical risk — post-operative bleeding and fever'], coachingNote: 'Correct triage — document the time of ER advice.' },
    actions: [['Notify on-call surgeon of post-op bleeding and confirm ER arrival', 'Clinical / Nursing Support', 'Critical', 'Patient safety risk — post-op bleeding', 'Done']],
  },
  {
    hoursAgo: 46,
    transcript: 'Agent: Member services.\nCaller: I think someone used my insurance card. My EOB shows a visit in another state that I never had.\nAgent: I will flag this for our fraud unit and place an alert on your account.',
    analysis: { summary: 'Member Linda Ortiz reported an EOB showing an out-of-state visit she never had. The agent flagged suspected identity fraud and placed an account alert.', category: 'Claim', callerType: 'Member', sentiment: 'Negative', urgency: 'Critical', resolutionStatus: 'Escalation needed', entities: { name: 'Linda Ortiz', memberId: 'MBR-44190-7731' }, riskFlags: ['Fraud suspicion — possible medical identity theft'], coachingNote: 'Advise member to request a replacement card.' },
    actions: [
      ['Open fraud investigation for suspected medical identity theft', 'Compliance & Legal', 'Critical', 'Fraud suspicion', 'In Progress'],
      ['Hold and review out-of-state claim on member account', 'Claims & Adjudication', 'High', 'Suspicious claim on EOB', 'To Do'],
    ],
  },
  {
    hoursAgo: 58,
    transcript: 'Agent: Scheduling.\nCaller: Can I book a follow-up with cardiology in the next two weeks?\nAgent: I have the 21st at 2 PM with Dr. Nguyen.',
    analysis: { summary: 'Patient Frank Miller booked a cardiology follow-up with Dr. Nguyen on the 21st at 2 PM.', category: 'Appointment', callerType: 'Patient', sentiment: 'Positive', urgency: 'Low', resolutionStatus: 'Resolved', entities: { name: 'Frank Miller', appointmentDate: '21st, 2:00 PM' }, riskFlags: [], coachingNote: 'Great call.' },
    actions: [['Send cardiology follow-up confirmation', 'Appointment Scheduling', 'Low', 'New booking', 'Done']],
  },
  {
    hoursAgo: 70,
    transcript: 'Agent: Billing.\nCaller: I set up an EMI plan but $600 was taken in one payment. I cannot afford that.\nAgent: I will reverse it and re-apply the installment plan.',
    analysis: { summary: 'Patient Priya Shah reported $600 debited in one payment despite an EMI installment plan. The agent committed to reversing the charge and re-applying the plan.', category: 'Billing', callerType: 'Patient', sentiment: 'Negative', urgency: 'High', resolutionStatus: 'Pending', entities: { name: 'Priya Shah', amount: '$600' }, riskFlags: ['Financial hardship indicated'], coachingNote: 'Offer financial counseling resources.' },
    actions: [['Reverse $600 lump-sum debit and restore EMI plan', 'Billing & Payments', 'High', 'EMI/payment issue; time-sensitive', 'In Progress']],
  },
  {
    hoursAgo: 82,
    transcript: 'Agent: Pharmacy.\nCaller: My doctor prescribed a new statin but my plan says it needs prior authorization.\nAgent: I will start the PA request with your prescriber.',
    analysis: { summary: 'Member Kevin Wright\'s new statin prescription requires prior authorization. The agent initiated the PA request with the prescriber.', category: 'Pharmacy', callerType: 'Member', sentiment: 'Neutral', urgency: 'Medium', resolutionStatus: 'Pending', entities: { name: 'Kevin Wright', medication: 'Rosuvastatin 20 mg' }, riskFlags: [], coachingNote: 'Mention a formulary alternative while PA is pending.' },
    actions: [['Initiate prior authorization for rosuvastatin', 'Pharmacy', 'Medium', 'Prescription coverage issue', 'Done']],
  },
  {
    hoursAgo: 100,
    transcript: 'Agent: Patient support.\nCaller: I was discharged yesterday and I am not sure how to change my wound dressing.\nAgent: A nurse will call you this afternoon to walk you through it.',
    analysis: { summary: 'Patient Helen Carter, discharged yesterday, needed wound-dressing instructions. A nurse callback was arranged for the same afternoon.', category: 'Clinical query', callerType: 'Patient', sentiment: 'Neutral', urgency: 'Medium', resolutionStatus: 'Pending', entities: { name: 'Helen Carter' }, riskFlags: [], coachingNote: 'Ask about signs of infection during triage.' },
    actions: [['Nurse callback for wound-care instructions', 'Clinical / Nursing Support', 'Medium', 'Post-discharge care instructions', 'Done']],
  },
  {
    hoursAgo: 118,
    transcript: 'Agent: Member services.\nCaller: You sent my medical records to the wrong address. That is a privacy violation and I am reporting it to the ombudsman.\nAgent: I apologize. I am escalating this to our privacy office immediately.',
    analysis: { summary: 'Member Rachel Adams reported her medical records were mailed to the wrong address and intends to report it to the ombudsman. The agent escalated to the privacy office.', category: 'Complaint', callerType: 'Member', sentiment: 'Angry', urgency: 'Critical', resolutionStatus: 'Escalation needed', entities: { name: 'Rachel Adams' }, riskFlags: ['Privacy breach — PHI misdirected', 'Ombudsman mention'], coachingNote: 'Good escalation — log the incident number for the member.' },
    actions: [
      ['Privacy incident review — misdirected medical records', 'Compliance & Legal', 'Critical', 'Privacy breach and ombudsman mention', 'Done'],
      ['Grievance acknowledgement letter to member', 'Customer Grievance & Escalations', 'High', 'Angry caller; service failure', 'Done'],
    ],
  },
  {
    hoursAgo: 140,
    transcript: 'Agent: Claims.\nCaller: My ambulance claim was denied as not medically necessary.\nAgent: I will help you file an appeal and send you the form today.',
    analysis: { summary: 'Member Victor Lee\'s ambulance claim was denied as not medically necessary. The agent explained the appeals process and committed to send the appeal form today.', category: 'Claim', callerType: 'Member', sentiment: 'Negative', urgency: 'Medium', resolutionStatus: 'Pending', entities: { name: 'Victor Lee', claimNumber: 'CLM-2026-61045', amount: '$1,280' }, riskFlags: [], coachingNote: 'Good appeal-rights disclosure.' },
    actions: [['Send appeal form and track ambulance claim appeal', 'Claims & Adjudication', 'Medium', 'Denied claim appeal', 'Done']],
  },
  {
    hoursAgo: 160,
    transcript: 'Agent: Scheduling.\nCaller: I need to cancel my physical therapy sessions for next month, I am travelling.\nAgent: All four sessions are cancelled.',
    analysis: { summary: 'Patient Nina Fischer cancelled four physical therapy sessions next month due to travel. The request was completed on the call.', category: 'Appointment', callerType: 'Patient', sentiment: 'Neutral', urgency: 'Low', resolutionStatus: 'Resolved', entities: { name: 'Nina Fischer' }, riskFlags: [], coachingNote: 'Offer to pre-book return sessions.' },
    actions: [['Offer PT rebooking on patient\'s return', 'Appointment Scheduling', 'Low', 'Cancellation follow-up', 'To Do']],
  },
]

export function buildSeedData(now = Date.now()): { calls: CallRecord[]; actions: ActionItem[] } {
  const calls: CallRecord[] = []
  const actions: ActionItem[] = []
  SEEDS.forEach((seed, i) => {
    const id = `CL-${10400 + SEEDS.length - i}`
    const created = now - seed.hoursAgo * 36e5
    const analysis = normalizeAnalysis({
      patientRequests: [],
      complaints: [],
      agentCommitments: [],
      ...seed.analysis,
      actions: seed.actions.map(([title, team, priority, routingReason]) => ({
        title,
        team,
        priority,
        dueInHours: DUE_HOURS_BY_PRIORITY[priority],
        routingReason,
      })),
    })
    calls.push({ id, createdAt: new Date(created).toISOString(), transcript: seed.transcript, analysis, source: 'seed' })
    seed.actions.forEach(([title, team, priority, routingReason, status], j) => {
      actions.push({
        id: `${id}-A${j + 1}`,
        callId: id,
        title,
        team,
        priority,
        routingReason,
        dueAt: new Date(created + DUE_HOURS_BY_PRIORITY[priority] * 36e5).toISOString(),
        routed: status !== 'Unrouted',
        status: status === 'Unrouted' ? 'To Do' : status,
      })
    })
  })
  return { calls, actions }
}
