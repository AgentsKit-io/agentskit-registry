import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCopyReviewerAgent } from './agent'

const M = (contentious: boolean) => ({
  line: 'L3',
  currentText: 'Synergize your runs!',
  suggestedRewrite: 'Run your way.',
  rationale: 'guide bans "synergize" (banned-words list)',
  contentious,
})
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_review', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-copy-reviewer', () => {
  it('returns typed misalignments; no routing when nothing is contentious', async () => {
    const r = await createCopyReviewerAgent({ adapter: model({ misalignments: [M(false)], overallAssessment: 'minor tweaks' }) }).run('GUIDE...\nDRAFT...')
    expect(r.misalignments[0].suggestedRewrite).toBe('Run your way.')
    expect(r.routeToHuman).toBe(false)
  })

  it('routes to the account lead when a call is contentious', async () => {
    const r = await createCopyReviewerAgent({ adapter: model({ misalignments: [M(false), M(true)], overallAssessment: 'one judgment call' }) }).run('GUIDE...\nDRAFT...')
    expect(r.routeToHuman).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createCopyReviewerAgent({ adapter: model({ misalignments: [], overallAssessment: '' }) }).run('  ')).rejects.toThrow(/brand guide/)
  })
})
