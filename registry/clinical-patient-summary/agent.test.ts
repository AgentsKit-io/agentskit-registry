import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPatientSummaryAgent } from './agent'

describe('clinical-patient-summary', () => {
  it('runs against a mock adapter', async () => {
    const agent = createPatientSummaryAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
