import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsBackupRestoreVerifierAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_restore_verifier', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-backup-restore-verifier', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsBackupRestoreVerifierAgent({ adapter: model({ title: 'Backup Restore Verifier', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for devops-backup-restore-verifier')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsBackupRestoreVerifierAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
