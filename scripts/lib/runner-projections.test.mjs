import { describe, expect, it } from 'vitest'
import { createRunnerProjections } from './runner-projections.mjs'

describe('runner projections', () => {
  it('keeps source install verified and host support conservative', () => {
    const projections = createRunnerProjections({ id: 'coding-code-qa', installable: true, runnable: true })

    expect(projections.source).toEqual({
      status: 'verified',
      command: 'npx agentskit add coding-code-qa',
    })
    expect(projections.mcp).toMatchObject({ status: 'partial', transport: 'stdio', package: '@agentskit/mcp' })
    expect(projections.codex.status).toBe('planned')
    expect(projections.claude.status).toBe('planned')
    expect(projections.cursor.status).toBe('planned')
    expect(projections.deepseek.status).toBe('planned')
    expect(projections.gemini.status).toBe('planned')
    expect(projections.kimi.status).toBe('planned')
    expect(projections.grok.status).toBe('planned')
    expect(projections.hermes.status).toBe('planned')
  })

  it('does not advertise draft or non-runnable agents', () => {
    const projections = createRunnerProjections({ id: 'draft-agent', installable: false, runnable: false })

    expect(Object.values(projections).every(({ status }) => status === 'unsupported')).toBe(true)
  })

  it('accepts explicit evidence overrides and rejects unknown targets', () => {
    const projections = createRunnerProjections({
      id: 'coding-code-qa',
      installable: true,
      runnable: true,
      overrides: {
        mcp: { status: 'verified', evidence: 'clean-host-smoke-test' },
        codex: { status: 'partial', note: 'MCP path verified; native skill pending' },
      },
    })

    expect(projections.mcp).toMatchObject({ status: 'verified', evidence: 'clean-host-smoke-test' })
    expect(projections.codex).toMatchObject({ status: 'partial', note: 'MCP path verified; native skill pending' })
    expect(() => createRunnerProjections({ id: 'agent', installable: true, runnable: true, overrides: { unknown: { status: 'planned' } } })).toThrow('unknown runner projection target')
    expect(() => createRunnerProjections({ id: 'agent', installable: true, runnable: true, overrides: { mcp: { status: 'maybe' } } })).toThrow('mcp.status must be one of')
  })
})
