import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesDemoScriptAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_script_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-demo-script-author', () => {
  it('returns typed output', async () => {
    const r = await createSalesDemoScriptAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-demo-script-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesDemoScriptAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
