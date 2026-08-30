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

  it('accepts evidence states for runner projections', () => {
    const { root } = fixture({ projections: { mcp: { status: 'partial', note: 'smoke test pending' } } })
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

  it('rejects malformed runner projection metadata', () => {
    const { root } = fixture({ projections: {
      unknown: { status: 'planned' },
      codex: { status: 'maybe' },
      mcp: { resultToolName: 'not valid', status: 'planned' },
    } })
    const messages = validateExternalAgents(root, policy).errors.map((error) => error.message)
    expect(messages).toContain('unsupported projection target "unknown"')
    expect(messages).toContain('projection codex.status must be one of verified, partial, planned, unsupported')
    expect(messages).toContain('projection mcp.resultToolName must be a valid tool name')
  })

  it('requires an output schema for typed projections', () => {
    const missing = fixture({ projections: { mcp: { status: 'planned', mode: 'typed' } } })
    expect(validateExternalAgents(missing.root, policy).errors.map((error) => error.message)).toContain(
      'projection mcp.outputSchema is required for typed projections',
    )

    const invalid = fixture({ projections: { mcp: { status: 'planned', mode: 'typed', outputSchema: [] } } })
    expect(validateExternalAgents(invalid.root, policy).errors.map((error) => error.message)).toContain(
      'projection mcp.outputSchema must be an object',
    )
  })

  it('rejects paths outside the caller workspace', () => {
    const { workspace } = fixture()
    expect(() => resolveValidationRoot(workspace, '../outside')).toThrow('path must stay inside GITHUB_WORKSPACE')
  })
})
