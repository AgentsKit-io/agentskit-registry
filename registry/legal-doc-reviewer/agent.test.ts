import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalDocReviewerAgent } from './agent'

const model = (findings: unknown[] | 'silent') =>
  mockAdapter({
    response: () =>
      findings === 'silent'
        ? [{ type: 'text', content: 'no findings' }, { type: 'done' }]
        : [
            { type: 'tool_call', toolCall: { id: 't', name: 'submit_findings', args: JSON.stringify({ findings }) } },
            { type: 'done' },
          ],
  })

describe('legal-doc-reviewer', () => {
  it('contract mode produces typed findings', async () => {
    const r = await createLegalDocReviewerAgent({
      adapter: model([{ id: 'f1', severity: 'high', category: 'risky-clause', title: 'Unbounded indemnity', detail: 'no cap', location: '§7' }]),
      mode: 'contract',
    }).run('contract text')
    expect(r.mode).toBe('contract')
    expect(r.findings[0]?.category).toBe('risky-clause')
    expect(r.requiresAttorneyReview).toBe(true) // high severity
  })

  it('discovery: a privileged finding requires attorney review', async () => {
    const r = await createLegalDocReviewerAgent({
      adapter: model([{ id: 'f1', severity: 'medium', category: 'privileged', title: 'Atty-client email', detail: 'privileged thread' }]),
      mode: 'discovery',
    }).run('doc')
    expect(r.requiresAttorneyReview).toBe(true) // privileged category
  })

  it('clean low-severity review → no attorney review required', async () => {
    const r = await createLegalDocReviewerAgent({
      adapter: model([{ id: 'f1', severity: 'low', category: 'responsive', title: 'Responsive ref', detail: 'mentions matter' }]),
      mode: 'discovery',
    }).run('doc')
    expect(r.requiresAttorneyReview).toBe(false)
  })

  it('FAIL-SAFE: a failed review escalates to an attorney', async () => {
    const r = await createLegalDocReviewerAgent({ adapter: model('silent'), mode: 'privilege' }).run('doc')
    expect(r.requiresAttorneyReview).toBe(true)
    expect(r.findings[0]?.category).toBe('review-error')
  })

  it('refuses empty document', async () => {
    await expect(createLegalDocReviewerAgent({ adapter: model([]), mode: 'contract' }).run('  ')).rejects.toThrow(/document/)
  })
})
