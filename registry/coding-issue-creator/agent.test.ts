import { describe, it, expect, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createIssueCreatorAgent } from './agent'

const ISSUES = [
  { title: 'reset email sent within 1m', body: 'DoD: ...', labels: ['enhancement', 'automated'] },
  { title: 'fix token expiry off-by-one', body: 'DoD: ...', labels: ['bug', 'automated'] },
]
const model = (issues: unknown[]) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_issues', args: JSON.stringify({ issues }) } },
      { type: 'done' },
    ],
  })

describe('coding-issue-creator', () => {
  it('drafts issues and reports the real number/url when created (approved)', async () => {
    let n = 100
    const createIssue = vi.fn(async (i: { title: string }) => ({ number: ++n, url: `https://gh/${n}` }))
    const r = await createIssueCreatorAgent({ adapter: model(ISSUES), createIssue, autoApprove: true }).run('PRD json')
    expect(createIssue).toHaveBeenCalledTimes(2)
    expect(r.created[0]).toMatchObject({ ok: true, number: 101 })
  })

  it('never fakes creation when no transport is wired', async () => {
    const r = await createIssueCreatorAgent({ adapter: model(ISSUES) }).run('PRD json')
    expect(r.drafts).toHaveLength(2)
    expect(r.created).toEqual([])
  })

  it('is fail-closed: transport set but not approved creates nothing', async () => {
    const createIssue = vi.fn(async () => ({ number: 1, url: 'x' }))
    const r = await createIssueCreatorAgent({ adapter: model(ISSUES), createIssue }).run('PRD json')
    expect(createIssue).not.toHaveBeenCalled()
    expect(r.requiresApproval).toBe(true)
    expect(r.created.every((c) => c.skipped)).toBe(true)
  })

  it('refuses an empty PRD', async () => {
    await expect(createIssueCreatorAgent({ adapter: model(ISSUES) }).run('  ')).rejects.toThrow(/PRD/)
  })
})
