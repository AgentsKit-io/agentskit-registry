import { describe, it, expect } from 'vitest'
import { createMcp, TOOLS, type Summary } from './mcp'

const index: Summary[] = [
  { id: 'research', title: 'Research Agent', description: 'Citation-first web research', category: 'research', tags: ['rag'], runnable: true },
  { id: 'code-review', title: 'Code Review', description: 'Deep low-noise review', category: 'coding', tags: ['ci'], runnable: false },
  { id: 'support-triage-bot', title: 'Triage Bot', description: 'Classify inbound tickets', category: 'support', tags: [], runnable: true },
]
const bundles: Record<string, any> = {
  research: { id: 'research', title: 'Research Agent', sources: [{ path: 'agent.ts', content: 'export const x = 1' }] },
  'code-review': { id: 'code-review', title: 'Code Review', sources: [] },
  'support-triage-bot': { id: 'support-triage-bot', title: 'Triage Bot', sources: [] },
}

const mcp = createMcp({ index, bundles, site: 'https://registry.agentskit.io' })

// helper: parse the JSON text payload a tool returns
const data = (r: any) => JSON.parse(r.result.content[0].text)

describe('MCP protocol', () => {
  it('initialize returns protocol + serverInfo', () => {
    const r = mcp.handleRpc({ id: 1, method: 'initialize' })!
    expect(r.result).toMatchObject({ protocolVersion: '2024-11-05', serverInfo: { name: 'agentskit-registry' } })
  })

  it('tools/list returns the four tools', () => {
    const r = mcp.handleRpc({ id: 2, method: 'tools/list' })!
    const names = (r.result as any).tools.map((t: any) => t.name)
    expect(names).toEqual(['list_agents', 'get_agent', 'search_agents', 'get_install_command'])
    expect(TOOLS).toHaveLength(4)
  })

  it('ping returns empty result', () => {
    expect(mcp.handleRpc({ id: 3, method: 'ping' })!.result).toEqual({})
  })

  it('notifications get no response', () => {
    expect(mcp.handleRpc({ method: 'notifications/initialized' })).toBeNull()
  })

  it('unknown method returns -32601', () => {
    const r = mcp.handleRpc({ id: 9, method: 'does/not/exist' })!
    expect(r.error?.code).toBe(-32601)
  })
})

describe('MCP tools', () => {
  it('list_agents returns all, sorted by title', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'list_agents' } })!
    const d = data(r)
    expect(d.count).toBe(3)
    expect(d.agents[0].title).toBe('Code Review') // alphabetical
  })

  it('list_agents filters by category', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'list_agents', arguments: { category: 'coding' } } })!
    const d = data(r)
    expect(d.count).toBe(1)
    expect(d.agents[0].id).toBe('code-review')
  })

  it('get_agent returns the full bundle', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'get_agent', arguments: { id: 'research' } } })!
    expect(data(r).sources[0].path).toBe('agent.ts')
  })

  it('get_agent errors on unknown id', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'get_agent', arguments: { id: 'nope' } } })!
    expect((r.result as any).isError).toBe(true)
  })

  it('search_agents matches free text', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'search_agents', arguments: { query: 'ticket' } } })!
    const d = data(r)
    expect(d.count).toBe(1)
    expect(d.agents[0].id).toBe('support-triage-bot')
  })

  it('search_agents filters by runnable + tag', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'search_agents', arguments: { runnable: true } } })!
    expect(data(r).count).toBe(2)
    const r2 = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'search_agents', arguments: { tag: 'ci' } } })!
    expect(data(r2).agents[0].id).toBe('code-review')
  })

  it('get_install_command returns the npx command + bundle url', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'get_install_command', arguments: { id: 'research' } } })!
    const d = data(r)
    expect(d.install).toBe('npx agentskit add research')
    expect(d.bundle).toBe('https://registry.agentskit.io/r/research.json')
  })

  it('unknown tool errors', () => {
    const r = mcp.handleRpc({ id: 1, method: 'tools/call', params: { name: 'bogus' } })!
    expect((r.result as any).isError).toBe(true)
  })
})
