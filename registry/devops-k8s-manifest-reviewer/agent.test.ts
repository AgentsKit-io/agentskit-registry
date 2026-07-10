import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsK8sManifestReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_manifest_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-k8s-manifest-reviewer', () => {
  it('returns typed output', async () => {
    const r = await createDevopsK8sManifestReviewerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-k8s-manifest-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDevopsK8sManifestReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
