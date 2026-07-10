import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeHandoffAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_handoff_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-doc-bridge-handoff-author', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemDocBridgeHandoffAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-doc-bridge-handoff-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemDocBridgeHandoffAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
