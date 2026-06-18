import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createKnowledgePromoterAgent, type PreparedDoc } from './agent'

// One canned payload per stage; the mock returns whichever submit tool the
// runtime is currently offering, so it's robust to extra ReAct loop turns.
const payloads: Record<string, unknown> = {
  submit_classification: { isGeneralizable: true, category: 'ui-ux', shape: 'enrich', targetDoc: 'pillars/ui-ux/universal.md', alreadyCovered: false, reason: 'transferable' },
  submit_sanitized: { title: 'Equal-Height Columns', description: 'Force structurally.', type: 'pattern', body: '# Equal-Height Columns\n\nUse flex/grid.', droppedForGenerality: ['internal page name'] },
  submit_leak_verdict: { verdict: 'clean', identifiers: [], explanation: 'no project-specific detail' },
}

const respondWith = (overrides: Record<string, unknown> = {}) =>
  mockAdapter({
    response: (req) => {
      const name = req.context?.tools?.[0]?.name ?? ''
      const payload = overrides[name] ?? payloads[name] ?? {}
      return [{ type: 'tool_call', toolCall: { id: 't', name, args: JSON.stringify(payload) } }, { type: 'done' }]
    },
  })

describe('knowledge-promoter agent', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn(async () => new Response('SITE MAP'))))
  afterEach(() => vi.unstubAllGlobals())

  it('classifies, sanitizes, leak-gates, then publishes one draft', async () => {
    const published: PreparedDoc[][] = []
    const agent = createKnowledgePromoterAgent({
      adapter: respondWith(),
      siteMapUrl: 'https://example.com/llms.txt',
      houseStyle: 'TL;DR -> For agents -> See also',
      denylist: [/\bACME-\d+\b/],
      publish: async (docs) => {
        published.push(docs)
        return { pr: 7 }
      },
    })

    const { outcomes, pr } = await agent.run([{ id: '1', title: 'Equal-height columns', lesson: 'raw lesson with internal context' }])

    expect(outcomes[0]?.status).toBe('promoted')
    expect(published).toHaveLength(1)
    expect(published[0]?.[0]?.markdown).toContain('type: pattern')
    expect(pr?.pr).toBe(7)
  })

  it('blocks a candidate when the regex denylist hits — and never publishes', async () => {
    const publish = vi.fn()
    const agent = createKnowledgePromoterAgent({
      adapter: respondWith({ submit_sanitized: { ...(payloads.submit_sanitized as object), body: 'leaked ACME-42 reference' } }),
      siteMapUrl: 'https://example.com/llms.txt',
      houseStyle: 'x',
      denylist: [/\bACME-\d+\b/],
      publish,
    })

    const { outcomes, pr } = await agent.run([{ id: '1', title: 't', lesson: 'l' }])

    expect(outcomes[0]?.status).toBe('blocked')
    expect(publish).not.toHaveBeenCalled()
    expect(pr).toBeUndefined()
  })
})
