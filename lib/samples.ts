export type SampleCall = {
  id: string
  label: string
  description: string
  transcript: string
}

export const SAMPLE_CALLS: SampleCall[] = [
  {
    id: 'claim-denial',
    label: 'Insurance claim denial complaint',
    description: 'Repeat caller, denied MRI claim',
    transcript: `Agent: Thank you for calling BlueCrest Health Plan member services, this is Priya. May I have your name and member ID?
Caller: Yeah, it's Robert Mendes. Member ID is BCH-7781-4521.
Agent: Thank you, Mr. Mendes. For verification, can you confirm your date of birth?
Caller: March 14th, 1968. Look, I'm calling because my claim for my MRI got denied. Claim number CLM-2026-88213. This is the second time I'm calling about this.
Agent: I'm sorry to hear that. Let me pull it up. I see the claim for $2,340 from Riverside Imaging on September 22nd was denied for "prior authorization not on file."
Caller: That's ridiculous. My doctor's office told me they sent the authorization two weeks before the scan. Nobody from your side called me back last time like they promised.
Agent: I understand your frustration. I can see a note from your previous call on October 2nd. It looks like the callback was not completed, and I apologize for that.
Caller: I just want this fixed. I can't afford a $2,340 bill.
Agent: I'm going to submit a reconsideration request today and request the authorization record from Dr. Alvarez's office. I'll also flag this as a repeat contact. You should hear back within 5 business days, and I'll personally call you within 48 hours with an update.
Caller: Fine. And make sure Riverside doesn't send this to collections.
Agent: I'll add a note asking the provider to hold billing while the claim is under review. Is there anything else?
Caller: No. Just please actually call me back this time.`,
  },
  {
    id: 'reschedule-refill',
    label: 'Appointment reschedule + prescription refill',
    description: 'Friendly patient, two requests',
    transcript: `Agent: Good morning, Lakeview Medical Group patient services, this is Daniel speaking.
Caller: Hi Daniel, this is Maria Gonzalez. I have an appointment with Dr. Chen on October 16th at 10 AM and I need to move it.
Agent: Sure, Ms. Gonzalez. Can I get your date of birth and patient ID?
Caller: June 2nd, 1975. Patient ID is LMG-30958.
Agent: Thank you. What dates work better for you?
Caller: Anything the week after, preferably mornings. Oh, and I also need a refill on my lisinopril, 10 milligrams. I've got about three pills left.
Agent: Okay. I have October 23rd at 9:30 AM with Dr. Chen. Would that work?
Caller: Perfect, yes.
Agent: Great, you're booked for October 23rd at 9:30 AM, and I've cancelled the 16th. For the refill, I'll send a request to Dr. Chen's nurse team. Which pharmacy?
Caller: The Walgreens on Elm Street. Will it be ready before I run out?
Agent: Refill requests are usually processed within 24 to 48 hours. I'll mark it as urgent since you have three days left. You'll get a text when it's sent to the pharmacy.
Caller: Thank you so much, that's really helpful.
Agent: You're welcome! Anything else?
Caller: No, that's all. Have a good day.`,
  },
  {
    id: 'billing-regulator',
    label: 'Billing dispute with regulator threat',
    description: 'Angry caller, collections, legal mention',
    transcript: `Agent: Thank you for calling Summit Regional Hospital billing, this is Kevin.
Caller: Yes, this is Angela Brooks. I'm calling about invoice INV-554219. You charged me $4,870 for an ER visit that my insurance already paid for.
Agent: Let me look that up, Ms. Brooks. Can you verify your date of birth?
Caller: November 30th, 1982. And I've called three times already. Three times! Every time someone says it'll be fixed and then I get another bill.
Agent: I'm very sorry. I see your ER visit on August 9th. Your insurer, Meridian Health, paid $3,200, and the system shows a balance of $4,870 billed to you.
Caller: That's not even possible. The total bill was $5,100. And now I'm getting calls from a collections agency. That is harassment. If this isn't fixed this week, I'm filing a complaint with the state insurance commissioner and talking to a lawyer.
Agent: I completely understand. It looks like the insurance payment may not have been applied to your account. I'm going to open a billing dispute and put your account on hold so it is not sent further to collections.
Caller: I want a corrected statement and a written apology.
Agent: I will escalate this to my supervisor and our patient advocate. You'll receive a call from a supervisor within 24 hours and a corrected statement within 5 business days.
Caller: And I want to know why my information was given to a collection agency while it was in dispute.
Agent: That's a fair question. I'll include that in the escalation.`,
  },
  {
    id: 'discharge-homecare',
    label: 'Family member: discharge & home care',
    description: 'Proxy caller, safety concerns',
    transcript: `Agent: Mercy General patient support line, this is Sarah. How can I help?
Caller: Hi, my name is David Kim. My father, Henry Kim, was admitted last week after a fall and the doctors said he might be discharged tomorrow. I'm trying to figure out what happens next.
Agent: I can help with that. Do you have his patient number? And are you listed as an authorized contact?
Caller: Yes, I'm his healthcare proxy. His MRN is MGH-882047.
Agent: Thank you, Mr. Kim. I see the discharge is planned for October 14th. The care team has recommended home health nursing and physical therapy.
Caller: Okay, but who arranges that? I work full time. And he's on blood thinners now, warfarin, and I'm worried about him falling again. He was also a bit confused yesterday, which isn't like him.
Agent: That's an important concern. I'll make sure the nursing team knows about the confusion before discharge. For home care, the case manager coordinates the agency referral. I'll ask them to call you today.
Caller: And do we need a walker or a hospital bed at home? Is that covered?
Agent: The physical therapist will assess equipment needs. Coverage for durable medical equipment depends on his plan, and the case manager can check that for you.
Caller: Okay. Also, I need to know what to do about his warfarin dosing and blood tests after he gets home.
Agent: The discharge nurse will review medication instructions and set up the INR monitoring schedule with you. I'll note that you'd like that education session by phone.
Caller: By phone, after 5 PM if possible. Thank you, this is a lot.
Agent: Of course. You'll get a call from the case manager today and from the nurse before discharge.`,
  },
]
