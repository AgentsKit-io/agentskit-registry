import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrBenefitsFaqBotAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_faq_bot', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-benefits-faq-bot', () => {
  it('returns typed output', async () => {
    const r = await createHrBenefitsFaqBotAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-benefits-faq-bot')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrBenefitsFaqBotAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
