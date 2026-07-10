import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceFulfillmentSlaMonitorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_sla_monitor', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-fulfillment-sla-monitor', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceFulfillmentSlaMonitorAgent({ adapter: model({ title: 'Fulfillment SLA Monitor', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-fulfillment-sla-monitor')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceFulfillmentSlaMonitorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
