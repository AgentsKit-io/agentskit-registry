import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createQaAuthorAgent } from './agent'

const model = (specs: unknown[]) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_specs', args: JSON.stringify({ specs }) } },
      { type: 'done' },
    ],
  })

describe('coding-qa-author', () => {
  it('returns typed spec stubs', async () => {
    const r = await createQaAuthorAgent({ adapter: model([{ path: 'a.test.ts', body: 'describe(...)', criteria: [1] }]) }).run('PRD json')
    expect(r.specs[0].path).toBe('a.test.ts')
    expect(r.requiresReview).toBe(true)
  })

  it('flags uncovered criteria when a count is supplied', async () => {
    const r = await createQaAuthorAgent({ adapter: model([{ path: 'a.test.ts', body: 'x', criteria: [1, 2] }]), criteriaCount: 4 }).run('PRD json')
    expect(r.uncovered).toEqual([3, 4])
  })

  it('refuses an empty PRD', async () => {
    await expect(createQaAuthorAgent({ adapter: model([]) }).run('  ')).rejects.toThrow(/PRD/)
  })
})
