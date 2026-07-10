import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesChurnSavePlaybookAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_save_playbook', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-churn-save-playbook', () => {
  it('returns typed output', async () => {
    const r = await createSalesChurnSavePlaybookAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-churn-save-playbook')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSalesChurnSavePlaybookAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
