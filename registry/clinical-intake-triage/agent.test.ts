import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createIntakeTriageAgent } from './agent'

const model = (urgency: string, opts: { silent?: boolean } = {}) =>
  mockAdapter({
    response: () =>
      opts.silent
        ? [{ type: 'text', content: 'no classification' }, { type: 'done' }]
        : [
            { type: 'tool_call', toolCall: { id: 't', name: 'submit_triage', args: JSON.stringify({ urgency, rationale: 'r', queue: 'general' }) } },
            { type: 'done' },
          ],
  })

describe('clinical-intake-triage', () => {
  it('SAFETY NET: a red-flag message is forced to emergency even when the model says routine', async () => {
    const r = await createIntakeTriageAgent({ adapter: model('routine') }).run('I have crushing chest pain since this morning')
    expect(r.urgency).toBe('emergency')
    expect(r.redFlagsHit.length).toBeGreaterThan(0)
    expect(r.requiresHumanTriage).toBe(true)
    expect(r.queue).toBe('EMERGENCY-911')
  })

  it('a benign message keeps the model classification', async () => {
    const r = await createIntakeTriageAgent({ adapter: model('administrative') }).run('Can I get a copy of my last invoice?')
    expect(r.urgency).toBe('administrative')
    expect(r.redFlagsHit).toHaveLength(0)
    expect(r.requiresHumanTriage).toBe(false)
  })

  it('unclear → requires human triage', async () => {
    const r = await createIntakeTriageAgent({ adapter: model('unclear') }).run('hello?')
    expect(r.requiresHumanTriage).toBe(true)
  })

  it('FAIL-SAFE: a failed classification goes to a human, not dropped', async () => {
    const r = await createIntakeTriageAgent({ adapter: model('x', { silent: true }) }).run('routine-looking message')
    expect(r.urgency).toBe('unclear')
    expect(r.requiresHumanTriage).toBe(true)
  })

  it('refuses an empty message', async () => {
    await expect(createIntakeTriageAgent({ adapter: model('routine') }).run('  ')).rejects.toThrow(/message/)
  })
})
