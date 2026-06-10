import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'clinical-intake-triage',
  cases: [
    {
      input: `Portal message from patient: "I've had crushing chest pain radiating to my left arm for the last 20 minutes and I feel short of breath. What should I do?"`,
      expected: (r: string) =>
        /emergency/i.test(r) && /911|emergency services/i.test(r),
    },
    {
      input: `Voicemail transcript: "Hi, this is about my refill for blood pressure medication. The pharmacy says it needs a new authorization. Can someone send that over when you get a chance? Thanks."`,
      expected: (r: string) =>
        /administrative|routine/i.test(r) && /queue/i.test(r),
    },
    {
      input: `Email: "My 6-year-old has had a fever of 102 since yesterday and is now refusing to drink fluids and seems very lethargic. Should I be worried?"`,
      expected: (r: string) =>
        /(urgent|emergency)/i.test(r) && /(rationale|because|queue|nurse)/i.test(r),
    },
    {
      input: `Portal message: "asdfgh test message please ignore lol 🙂🙂 not sure why im typing this"`,
      expected: (r: string) =>
        /(unclear|escalat|human|triage nurse|unsure)/i.test(r),
    },
  ],
}
