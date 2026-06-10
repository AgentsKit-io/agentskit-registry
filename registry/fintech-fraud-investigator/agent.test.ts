import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFraudInvestigatorAgent } from './agent'

describe('fintech-fraud-investigator', () => {
  it('runs against a mock adapter', async () => {
    const agent = createFraudInvestigatorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
