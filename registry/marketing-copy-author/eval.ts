import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'marketing-copy-author',
  cases: [
    {
      input: `Brief (JSON): { "objective": "conversion", "audience": "agency ops managers", "keyMessages": ["stop chasing timesheets", "real-time profitability", "onboard in under a day"], "tone": "confident, no jargon", "channels": ["LinkedIn", "email", "product page"], "timeline": "2026-07", "mandatories": ["Results may vary"], "voiceFlags": [] }. Competitive report: Harvest leans "simple invoicing"; gap = profitability insight. Write the three copy variants.`,
      expected: (r: string) =>
        /bold/i.test(r) && /warm/i.test(r) && /precise/i.test(r),
    },
    {
      input: `Brief (JSON): { "objective": "awareness", "audience": "gig workers 22-35", "keyMessages": ["round-up savings", "no minimum balance", "FDIC insured"], "tone": "empowering but trustworthy", "channels": ["LinkedIn", "email", "product page"], "timeline": "Q3", "mandatories": ["Member FDIC"], "voiceFlags": [] }. Competitive report: Chime emphasizes "no hidden fees". Produce three variants, each with a headline, cta, and targetPersona.`,
      expected: (r: string) =>
        /headline/i.test(r) && /cta/i.test(r) && /targetPersona/i.test(r),
    },
    {
      input: `Brief (JSON): { "objective": "conversion", "audience": "CTOs at Series B startups", "keyMessages": ["cut build times", "ship faster"], "tone": "precise, evidence-based", "channels": ["product page"], "timeline": "now", "mandatories": [], "voiceFlags": [] }. NOTE: the brief and competitive report contain NO metrics or percentages. Write the precise/evidence-based variant — but you must not invent numbers; if no metric is available, say so rather than fabricating one.`,
      expected: (r: string) =>
        /(no metric|cannot|unavailable|not (?:provided|available)|missing|no number|no data)/i.test(r),
    },
    {
      input: `Brief (JSON): { "objective": "retention", "audience": "month-to-month Acme CRM users with low adoption", "keyMessages": ["unlock unused features", "book a success call"], "tone": "supportive", "channels": ["email", "in-app", "LinkedIn"], "timeline": "ongoing", "mandatories": [], "voiceFlags": ["never shame the user"] }. Competitive report: rivals push annual lock-in aggressively. Return the three variants as a JSON array only.`,
      expected: (r: string) =>
        /\[/.test(r) && /variantId/i.test(r) && /(retention|success call|book)/i.test(r),
    },
  ],
}
