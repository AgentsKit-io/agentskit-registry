import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingApiContractReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_contract_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-api-contract-reviewer', () => {
  it('returns typed contract changes', async () => {
    const r = await createCodingApiContractReviewerAgent({
      adapter: model({
        summary: 'breaking removal',
        changes: [{ id: 'c1', kind: 'breaking', path: 'UserResponse.email', message: 'field removed' }],
        gaps: [],
        openQuestions: [],
      }),
    }).run('removed field email from UserResponse')
    expect(r.changes[0].kind).toBe('breaking')
    expect(r.requiresReview).toBe(true)
  })

  it('adds breaking safety net from input signals', async () => {
    const r = await createCodingApiContractReviewerAgent({
      adapter: model({ summary: 'diff', changes: [], gaps: [], openQuestions: [] }),
    }).run('type changed on UserResponse.id from string to number')
    expect(r.changes.some((c) => c.kind === 'breaking')).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createCodingApiContractReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})