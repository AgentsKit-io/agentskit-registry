import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityThreatIntelBriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_intel_brief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-threat-intel-brief', () => {
  it('returns typed output', async () => {
    const r = await createSecurityThreatIntelBriefAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for security-threat-intel-brief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSecurityThreatIntelBriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
