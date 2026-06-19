import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCopyAuthorAgent } from './agent'

const v = (variantId: string, body = 'short body') => ({
  variantId,
  headline: 'H',
  subheadline: 'S',
  body,
  cta: 'Buy',
  channel: 'LinkedIn',
  targetPersona: 'runner',
  toneRationale: 'fits',
})
const model = (variants: unknown[]) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_variants', args: JSON.stringify({ variants }) } },
      { type: 'done' },
    ],
  })

describe('marketing-copy-author', () => {
  it('returns exactly three typed variants', async () => {
    const r = await createCopyAuthorAgent({ adapter: model([v('bold'), v('warm'), v('precise')]) }).run('brief')
    expect(r.variants).toHaveLength(3)
    expect(r.variants.map((x) => x.variantId)).toEqual(['bold', 'warm', 'precise'])
    expect(r.overLength).toEqual([])
    expect(r.requiresReview).toBe(true)
  })

  it('flags an over-length variant body', async () => {
    const longBody = Array.from({ length: 20 }, () => 'word').join(' ')
    const r = await createCopyAuthorAgent({ adapter: model([v('bold', longBody), v('warm'), v('precise')]), maxWords: 10 }).run('brief')
    expect(r.overLength).toContain('bold')
  })

  it('refuses empty brief', async () => {
    await expect(createCopyAuthorAgent({ adapter: model([v('bold'), v('warm'), v('precise')]) }).run('  ')).rejects.toThrow(/structured brief/)
  })
})
