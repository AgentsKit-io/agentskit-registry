import { describe, it, expect, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevImplementerAgent } from './agent'

const PLAN = {
  files: [{ path: 'src/reset.ts', action: 'add', contents: 'export const reset = () => {}', reason: 'satisfies criterion 1' }],
  prTitle: 'feat(auth): password reset',
  notes: 'minimal patch',
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_plan', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-dev-implementer', () => {
  it('proposes a typed patch plan and opens no PR without a transport', async () => {
    const r = await createDevImplementerAgent({ adapter: model(PLAN) }).run('specs + prd')
    expect(r.plan.files[0].path).toBe('src/reset.ts')
    expect(r.plan.files[0].action).toBe('add')
    expect(r.pr).toBeUndefined()
  })

  it('opens a PR and reports the real url when approved', async () => {
    const openPr = vi.fn(async () => ({ url: 'https://gh/pr/7' }))
    const r = await createDevImplementerAgent({ adapter: model(PLAN), openPr, autoApprove: true }).run('specs + prd')
    expect(openPr).toHaveBeenCalledOnce()
    expect(r.pr).toEqual({ ok: true, url: 'https://gh/pr/7' })
  })

  it('is fail-closed: transport set but not approved opens nothing', async () => {
    const openPr = vi.fn(async () => ({ url: 'x' }))
    const r = await createDevImplementerAgent({ adapter: model(PLAN), openPr }).run('specs + prd')
    expect(openPr).not.toHaveBeenCalled()
    expect(r.requiresApproval).toBe(true)
    expect(r.pr).toMatchObject({ ok: false, skipped: true })
  })

  it('refuses empty input', async () => {
    await expect(createDevImplementerAgent({ adapter: model(PLAN) }).run('  ')).rejects.toThrow(/QA specs/)
  })
})
