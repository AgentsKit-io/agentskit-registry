import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductRoadmapNarratorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_roadmap_narrator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-roadmap-narrator', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductRoadmapNarratorAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for product-roadmap-narrator')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductRoadmapNarratorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
