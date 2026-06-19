import { describe, it, expect, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodeQaAgent } from './agent'

const reportModel = () =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_report', args: JSON.stringify({ failures: [{ reproducer: 'auth.test.ts:12 / pnpm test', command: 'pnpm test', message: 'expected 401', rootCause: 'expiry check' }], summary: '1 test failure' }) } },
      { type: 'done' },
    ],
  })

describe('coding-code-qa', () => {
  it('reports all green without calling the model when every command exits 0', async () => {
    const adapter = mockAdapter({ response: () => [{ type: 'text', content: 'unused' }] })
    const run = vi.fn(async () => ({ stdout: 'ok', stderr: '', code: 0, durationMs: 10 }))
    const r = await createCodeQaAgent({ adapter, run, commands: ['pnpm test', 'pnpm lint'] }).run('main')
    expect(run).toHaveBeenCalledTimes(2)
    expect(r.allGreen).toBe(true)
    expect(r.failures).toEqual([])
  })

  it('runs commands and analyses only the failing output into a typed report', async () => {
    const run = vi.fn(async (cmd: string) => (cmd === 'pnpm test' ? { stdout: 'FAIL', stderr: 'expected 401', code: 1 } : { stdout: 'ok', stderr: '', code: 0 }))
    const r = await createCodeQaAgent({ adapter: reportModel(), run, commands: ['pnpm test', 'pnpm lint'] }).run('feature/login')
    expect(r.allGreen).toBe(false)
    expect(r.failures[0].rootCause).toMatch(/expiry/)
    expect(r.commands.find((c) => c.command === 'pnpm test')?.code).toBe(1)
  })

  it('requires a run command runner', () => {
    // @ts-expect-error intentionally missing run
    expect(() => createCodeQaAgent({ adapter: reportModel(), commands: ['x'] })).toThrow(/run/)
  })
})
