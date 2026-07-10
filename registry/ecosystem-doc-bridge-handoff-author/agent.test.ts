import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeHandoffAuthorAgent } from './agent'

describe('ecosystem-doc-bridge-handoff-author', () => {
  it('constructs and returns typed output (draft scaffold)', async () => {
    const adapter = mockAdapter({
      response: () => [
        {
          type: 'tool_call',
          toolCall: {
            id: '1',
            name: 'submit_result',
            args: JSON.stringify({ summary: 'draft ok', gaps: [], openQuestions: [] }),
          },
        },
        { type: 'done' },
      ],
    })
    const r = await createEcosystemDocBridgeHandoffAuthorAgent({ adapter }).run('sample input')
    expect(r.summary).toBe('draft ok')
  })
})
