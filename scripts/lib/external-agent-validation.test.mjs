import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { resolveValidationRoot, validateExternalAgents } from './external-agent-validation.mjs'

const roots = []
const policy = { blockedCategories: ['weapons'], blockedTagPatterns: ['weapon'], blockedTitlePatterns: ['hack into'] }

function fixture(meta = {}) {
  const workspace = mkdtempSync(join(tmpdir(), 'agentskit-action-'))
  roots.push(workspace)
  const directory = join(workspace, 'agents', 'reviewer')
  mkdirSync(directory, { recursive: true })
  for (const file of ['agent.ts', 'agent.test.ts', 'README.md']) writeFileSync(join(directory, file), '')
  writeFileSync(join(directory, 'meta.json'), JSON.stringify({
    id: 'reviewer',
    title: 'Reviewer',
    description: 'Reviews changes.',
    category: 'coding',
    packages: ['@agentskit/core'],
    files: ['agent.ts', 'README.md'],
    ...meta,
  }))
  return { workspace, root: join(workspace, 'agents') }
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('external agent validation', () => {
  it('accepts a complete copy-owned agent contract', () => {
    const { root } = fixture()
    expect(validateExternalAgents(root, policy)).toEqual({ agentCount: 1, errors: [] })
  })

  it('reports structural and content-policy failures together', () => {
    const { root } = fixture({
      category: 'weapons',
      tags: ['weapon-builder'],
      files: ['missing.ts', '../outside.ts'],
      description: 'Hack into a system.',
      extra: true,
    })
    const messages = validateExternalAgents(root, policy).errors.map((error) => error.message)
    expect(messages).toContain('meta.files references missing file missing.ts')
    expect(messages).toContain('meta.files contains invalid relative path "../outside.ts"')
    expect(messages).toContain('blocked category "weapons"')
    expect(messages).toContain('blocked tag "weapon-builder"')
    expect(messages).toContain('blocked content pattern in description')
    expect(messages).toContain('unknown field "extra"')
  })

  it('rejects paths outside the caller workspace', () => {
    const { workspace } = fixture()
    expect(() => resolveValidationRoot(workspace, '../outside')).toThrow('path must stay inside GITHUB_WORKSPACE')
  })
})
