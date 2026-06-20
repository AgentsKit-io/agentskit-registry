import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRedactionBotAgent } from './agent'

const model = (payload: { redacted: string; log?: unknown[]; privilegeFlags?: unknown[] }) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_redaction', args: JSON.stringify({ log: [], privilegeFlags: [], ...payload }) } },
      { type: 'done' },
    ],
  })

describe('legal-redaction-bot', () => {
  it('BACKSTOP: strips a structured identifier the model left in', async () => {
    const agent = createRedactionBotAgent({ adapter: model({ redacted: 'Witness SSN 123-45-6789, email w@x.com. Claim proceeds.' }) })
    const r = await agent.run('raw doc')
    expect(r.redacted).not.toContain('123-45-6789')
    expect(r.redacted).not.toContain('w@x.com')
    expect(r.redacted).toContain('Claim proceeds')
    expect(r.status).toBe('backstop-applied')
  })

  it('surfaces privilege flags — never auto-redacts them', async () => {
    const agent = createRedactionBotAgent({ adapter: model({ redacted: 'Memo re strategy.', privilegeFlags: [{ span: 'attorney memo', basis: 'work-product' }] }) })
    const r = await agent.run('raw')
    expect(r.privilegeFlags).toHaveLength(1)
    expect(r.privilegeFlags[0]?.basis).toBe('work-product')
    expect(r.redacted).toContain('strategy') // privileged content NOT silently removed
  })

  it('extraRules catch account numbers', async () => {
    const agent = createRedactionBotAgent({
      adapter: model({ redacted: 'Account 12345678901 wired.' }),
      extraRules: [{ name: 'acct', pattern: /\b\d{8,17}\b/g, replacer: '[REDACTED_ACCT]' }],
    })
    const r = await agent.run('raw')
    expect(r.redacted).not.toContain('12345678901')
    expect(r.status).toBe('backstop-applied')
  })

  it('refuses empty document', async () => {
    await expect(createRedactionBotAgent({ adapter: model({ redacted: 'x' }) }).run('  ')).rejects.toThrow(/document/)
  })
})
