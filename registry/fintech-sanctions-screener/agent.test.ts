import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSanctionsScreenerAgent } from './agent'

// Adjudicator mock — returns the given decision, or no tool call to simulate failure.
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

const LIST = ['Vladimir Putin', 'Kim Jong Un']

describe('fintech-sanctions-screener', () => {
  it('HARD RULE: an exact/strong hit escalates and is never auto-cleared — even if the model would clear it', async () => {
    // Model is wired to "clear" everything; the strong hit must still escalate.
    const r = await createSanctionsScreenerAgent({ adapter: adj('false-positive'), sanctionsList: LIST }).run({ name: 'Vladimir Putin', country: 'RU' })
    expect(r.status).toBe('escalate')
    expect(r.requiresHumanSignoff).toBe(true)
    expect(r.hits[0]?.autoCleared).toBe(false)
    expect(r.hits[0]?.decision).toBe('true-match')
  })

  it('no match → clear, no LLM, no sign-off', async () => {
    const r = await createSanctionsScreenerAgent({ adapter: adj('true-match'), sanctionsList: LIST }).run({ name: 'Alice Johnson' })
    expect(r.status).toBe('clear')
    expect(r.hits).toHaveLength(0)
    expect(r.requiresHumanSignoff).toBe(false)
  })

  it('a WEAK hit the model clears as false-positive → cleared', async () => {
    const r = await createSanctionsScreenerAgent({
      adapter: adj('false-positive'),
      sanctionsList: LIST,
      strongThreshold: 0.999,
      screenThreshold: 0.6,
    }).run({ name: 'Vladimir Putin Jr', dob: '1990-01-01' })
    expect(r.hits[0]?.score).toBeLessThan(0.999)
    expect(r.hits[0]?.autoCleared).toBe(true)
    expect(r.status).toBe('clear')
  })

  it('FAIL-SAFE: a failed/silent adjudication escalates rather than clears', async () => {
    const r = await createSanctionsScreenerAgent({
      adapter: adj('silent'),
      sanctionsList: LIST,
      strongThreshold: 0.999,
      screenThreshold: 0.6,
    }).run({ name: 'Vladimir Putin Jr' })
    expect(r.status).toBe('escalate')
    expect(r.hits[0]?.autoCleared).toBe(false)
  })

  it('refuses a candidate with no legal name', async () => {
    await expect(
      createSanctionsScreenerAgent({ adapter: adj('true-match'), sanctionsList: LIST }).run({ name: '  ' }),
    ).rejects.toThrow(/legal name/)
  })
})
