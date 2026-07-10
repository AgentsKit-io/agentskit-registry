import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsIncidentCommanderAideAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_commander_aide', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-incident-commander-aide', () => {
  it('returns typed output', async () => {
    const r = await createOpsIncidentCommanderAideAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-incident-commander-aide')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createOpsIncidentCommanderAideAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
