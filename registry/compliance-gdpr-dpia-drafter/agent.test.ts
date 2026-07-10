import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceGdprDpiaDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_dpia_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('compliance-gdpr-dpia-drafter', () => {
  it('returns typed output', async () => {
    const r = await createComplianceGdprDpiaDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for compliance-gdpr-dpia-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createComplianceGdprDpiaDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
