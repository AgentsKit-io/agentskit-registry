import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsRunbookAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_runbook_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-runbook-author', () => {
  it('returns typed output', async () => {
    const r = await createOpsRunbookAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-runbook-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createOpsRunbookAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
