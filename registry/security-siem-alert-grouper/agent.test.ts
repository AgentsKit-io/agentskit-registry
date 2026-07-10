import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecuritySiemAlertGrouperAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_alert_grouper', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('security-siem-alert-grouper', () => {
  it('returns typed v1 output', async () => {
    const r = await createSecuritySiemAlertGrouperAgent({ adapter: model({ summary: 'ok', clusters: [{ name: 'c1', theme: 't', items: ['a'] }], unassigned: [] }) }).run('sample input for security-siem-alert-grouper')
    expect(r.requiresReview).toBe(true)
    expect(r.clusters.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSecuritySiemAlertGrouperAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
