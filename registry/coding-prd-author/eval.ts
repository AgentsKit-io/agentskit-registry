import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-prd-author',
  cases: [
    {
      input: `We want to let users export their dashboard data as CSV. They should be able to pick a date range and download a file. It needs to handle large datasets without timing out.`,
      expected: (r: string) => /"criteria"/i.test(r) && /"openQuestions"/i.test(r) && /"outOfScope"/i.test(r),
    },
    {
      input: `Build a referral program: existing users get a unique link, and when a new user signs up via that link both get a 10 dollar credit. Fraud prevention should stop self-referrals.`,
      expected: (r: string) => /"problem"/i.test(r) && /"users"/i.test(r) && /referral/i.test(r),
    },
    {
      input: `Add real-time presence indicators to the chat so users can see who is online. Use whatever realtime tech makes sense.`,
      expected: (r: string) => /"openQuestions"/i.test(r) && /(realtime|websocket|transport|tech)/i.test(r),
    },
    {
      input: `Make the app better and increase engagement.`,
      expected: (r: string) => /"openQuestions"/i.test(r) && /(vague|unclear|undefined|ambiguous|what|which|specif)/i.test(r),
    },
  ],
}
