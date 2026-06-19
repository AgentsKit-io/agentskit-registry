import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createKycScreenerAgent } from './agent'

const adj = (decision: 'true-match' | 'false-positive' | 'silent') =>
  mockAdapter({
    response: () =>
      decision === 'silent'
        ? [{ type: 'text', content: 'no verdict' }, { type: 'done' }]
        : [
            { type: 'tool_call', toolCall: { id: 't', name: 'submit_verdict', args: JSON.stringify({ decision, rationale: 'r' }) } },
            { type: 'done' },
          ],
  })

const LISTS = [{ name: 'Vladimir Putin', list: 'PEP' }, { name: 'Jane Adverse', list: 'ADVERSE-MEDIA' }]

describe('fintech-kyc-screener', () => {
  it('refuses when a required field is missing (no guessing)', async () => {
    const r = await createKycScreenerAgent({ adapter: adj('true-match'), lists: LISTS }).run({ name: 'Jane Doe', dob: '', country: 'US' })
    expect(r.missing).toContain('dob')
    expect(r.requiresHumanSignoff).toBe(true)
    expect(r.riskTier).toBe('escalate')
  })

  it('HARD RULE: a strong/exact list hit escalates even when the model would clear it', async () => {
    const r = await createKycScreenerAgent({ adapter: adj('false-positive'), lists: LISTS }).run({ name: 'Vladimir Putin', dob: '1952-10-07', country: 'RU' })
    expect(r.riskTier).toBe('escalate')
    expect(r.hits[0]?.autoCleared).toBe(false)
    expect(r.hits[0]?.list).toBe('PEP')
  })

  it('clean identity → clear, no hits', async () => {
    const r = await createKycScreenerAgent({ adapter: adj('true-match'), lists: LISTS }).run({ name: 'Robert Brown', dob: '1990-03-03', country: 'CA' })
    expect(r.riskTier).toBe('clear')
    expect(r.hits).toHaveLength(0)
  })

  it('FAIL-SAFE: a failed adjudication of a weak hit escalates', async () => {
    const r = await createKycScreenerAgent({ adapter: adj('silent'), lists: LISTS, strongThreshold: 0.999, screenThreshold: 0.6 }).run({ name: 'Vladimir Putin Jr', dob: '1990-01-01', country: 'RU' })
    expect(r.riskTier).toBe('escalate')
    expect(r.hits[0]?.autoCleared).toBe(false)
  })
})
