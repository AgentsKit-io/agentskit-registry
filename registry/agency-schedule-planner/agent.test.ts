import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSchedulePlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_schedule', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-schedule-planner', () => {
  it('returns a typed schedule, always requires approval', async () => {
    const r = await createSchedulePlannerAgent({
      adapter: model({ schedule: [{ date: '2026-07-01', channel: 'LinkedIn', assetId: 'A1', rationale: 'best window' }], conflicts: [] }),
    }).run('drafts + constraints')
    expect(r.schedule[0].assetId).toBe('A1')
    expect(r.conflicts).toEqual([])
    expect(r.requiresApproval).toBe(true)
  })

  it('surfaces conflicts rather than dropping items', async () => {
    const r = await createSchedulePlannerAgent({
      adapter: model({ schedule: [], conflicts: [{ type: 'embargo', assetIds: ['A1', 'A2'], detail: 'both before embargo lifts' }] }),
    }).run('drafts + constraints')
    expect(r.conflicts[0].type).toBe('embargo')
    expect(r.conflicts[0].assetIds).toContain('A1')
  })

  it('refuses empty input', async () => {
    await expect(createSchedulePlannerAgent({ adapter: model({ schedule: [], conflicts: [] }) }).run('  ')).rejects.toThrow(/approved drafts/)
  })
})
