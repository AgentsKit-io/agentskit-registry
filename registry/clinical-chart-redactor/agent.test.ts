import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createChartRedactorAgent } from './agent'

// Mock the model's redaction output: { redacted, log }.
const model = (redacted: string, log: Array<{ type: string; location: string; rationale: string }> = []) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_redaction', args: JSON.stringify({ redacted, log }) } },
      { type: 'done' },
    ],
  })

describe('clinical-chart-redactor', () => {
  it('BACKSTOP: redacts a structured identifier the model left in — output is always clean', async () => {
    // Model claims it is done but left an email + SSN in.
    const agent = createChartRedactorAgent({ adapter: model('Contact patient at a@b.com, SSN 123-45-6789. Dx: hypertension.') })
    const r = await agent.run('raw chart')
    expect(r.redacted).not.toContain('a@b.com')
    expect(r.redacted).not.toContain('123-45-6789')
    expect(r.redacted).toContain('hypertension') // clinical content preserved
    expect(r.status).toBe('backstop-applied')
    expect(r.log.some((e) => e.backstop && e.type === 'email')).toBe(true)
  })

  it('clean model output → status clean, model log preserved', async () => {
    const agent = createChartRedactorAgent({ adapter: model('Patient [REDACTED_NAME], Dx hypertension, Rx lisinopril.', [{ type: 'name', location: 'L1', rationale: 'patient name' }]) })
    const r = await agent.run('raw')
    expect(r.status).toBe('clean')
    expect(r.log).toHaveLength(1)
  })

  it('extraRules catch institution-specific identifiers (MRN)', async () => {
    const agent = createChartRedactorAgent({
      adapter: model('Record MRN-998877 for visit.'),
      extraRules: [{ name: 'mrn', pattern: /\bMRN-\d{6,}\b/gi, replacer: '[REDACTED_MRN]' }],
    })
    const r = await agent.run('raw')
    expect(r.redacted).not.toContain('MRN-998877')
    expect(r.redacted).toContain('[REDACTED_MRN]')
    expect(r.status).toBe('backstop-applied')
  })

  it('refuses empty chart text', async () => {
    await expect(createChartRedactorAgent({ adapter: model('x') }).run('   ')).rejects.toThrow(/chart/)
  })
})
