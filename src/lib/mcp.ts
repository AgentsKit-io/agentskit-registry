// Pure MCP logic (no Astro / Vite deps) so it is unit-testable. The endpoint
// (src/pages/api/mcp.ts) feeds it the registry data loaded via import.meta.glob.

export type Summary = {
  id: string
  title: string
  description: string
  category: string
  tags?: string[]
  packages?: string[]
  runnable: boolean
}

export type RpcRequest = { jsonrpc?: string; id?: string | number | null; method: string; params?: any }
export type RpcResponse = { jsonrpc: '2.0'; id: any; result?: unknown; error?: { code: number; message: string } }
export type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean }

export const DEFAULT_SITE = 'https://registry.agentskit.io'

export const TOOLS = [
  {
    name: 'list_agents',
    description: 'List all agents in the AgentsKit registry. Optionally filter by category.',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string', description: 'Filter by category id' } },
    },
  },
  {
    name: 'get_agent',
    description: 'Get the full bundle for one agent: metadata, env, skill, A2A card, and source files.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Agent id, e.g. "research"' } },
      required: ['id'],
    },
  },
  {
    name: 'search_agents',
    description: 'Search agents by free-text query, category, tag, or runnable flag.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string' },
        tag: { type: 'string' },
        runnable: { type: 'boolean' },
      },
    },
  },
  {
    name: 'get_install_command',
    description: 'Get the exact install command and a usage snippet for an agent.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
] as const

function text(obj: unknown): ToolResult {
  return { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }] }
}
function err(message: string): ToolResult {
  return { isError: true, content: [{ type: 'text', text: message }] }
}

export function createMcp(opts: { index: Summary[]; bundles: Record<string, any>; site?: string }) {
  const site = opts.site ?? DEFAULT_SITE
  const index = opts.index.slice().sort((a, b) => a.title.localeCompare(b.title))
  const bundles = opts.bundles

  function callTool(name: string, args: Record<string, any> = {}): ToolResult {
    switch (name) {
      case 'list_agents': {
        const list = args.category ? index.filter((a) => a.category === args.category) : index
        return text({ count: list.length, agents: list })
      }
      case 'get_agent': {
        const b = bundles[args.id]
        return b ? text(b) : err(`Unknown agent: ${args.id}`)
      }
      case 'search_agents': {
        const q = (args.query ?? '').toLowerCase()
        const res = index.filter((a) => {
          if (args.category && a.category !== args.category) return false
          if (args.tag && !(a.tags ?? []).includes(args.tag)) return false
          if (typeof args.runnable === 'boolean' && a.runnable !== args.runnable) return false
          if (q && !`${a.title} ${a.description} ${a.id}`.toLowerCase().includes(q)) return false
          return true
        })
        return text({ count: res.length, agents: res })
      }
      case 'get_install_command': {
        const b = bundles[args.id]
        if (!b) return err(`Unknown agent: ${args.id}`)
        return text({
          install: `npx agentskit add ${args.id}`,
          bundle: `${site}/r/${args.id}.json`,
          usage: `import { openai } from '@agentskit/adapters'\nimport { create...Agent } from './agents/${args.id}/agent'`,
        })
      }
      default:
        return err(`Unknown tool: ${name}`)
    }
  }

  // Returns null for notifications (no response expected).
  function handleRpc(msg: RpcRequest): RpcResponse | null {
    const { id, method, params } = msg
    const reply = (result: unknown): RpcResponse => ({ jsonrpc: '2.0', id, result })
    switch (method) {
      case 'initialize':
        return reply({
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'agentskit-registry', version: '1.0.0' },
        })
      case 'ping':
        return reply({})
      case 'tools/list':
        return reply({ tools: TOOLS })
      case 'tools/call':
        return reply(callTool(params?.name, params?.arguments ?? {}))
      default:
        if (method?.startsWith('notifications/')) return null
        return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } }
    }
  }

  return { tools: TOOLS, callTool, handleRpc }
}
