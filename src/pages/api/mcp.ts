import type { APIRoute } from 'astro'

// On-demand (serverless) — the Vercel adapter ships this as a function.
export const prerender = false

// Bundle the registry JSON into the function (public/ is not on disk at runtime).
const modules = import.meta.glob('/public/r/*.json', { eager: true, import: 'default' }) as Record<
  string,
  any
>

type Summary = {
  id: string
  title: string
  description: string
  category: string
  tags?: string[]
  packages?: string[]
  runnable: boolean
}

const index: Summary[] = []
const bundles: Record<string, any> = {}
for (const [path, data] of Object.entries(modules)) {
  const file = path.split('/').pop()!
  if (file === 'index.json') index.push(...(data.agents ?? []))
  else bundles[file.replace(/\.json$/, '')] = data
}
index.sort((a, b) => a.title.localeCompare(b.title))

const SITE = 'https://registry.agentskit.io'
const TOOLS = [
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
]

function text(obj: unknown) {
  return { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }] }
}

function callTool(name: string, args: Record<string, any>) {
  switch (name) {
    case 'list_agents': {
      const list = args.category ? index.filter((a) => a.category === args.category) : index
      return text({ count: list.length, agents: list })
    }
    case 'get_agent': {
      const b = bundles[args.id]
      if (!b) return { isError: true, content: [{ type: 'text', text: `Unknown agent: ${args.id}` }] }
      return text(b)
    }
    case 'search_agents': {
      const q = (args.query ?? '').toLowerCase()
      const res = index.filter((a) => {
        if (args.category && a.category !== args.category) return false
        if (args.tag && !(a.tags ?? []).includes(args.tag)) return false
        if (typeof args.runnable === 'boolean' && a.runnable !== args.runnable) return false
        if (q && !(`${a.title} ${a.description} ${a.id}`.toLowerCase().includes(q))) return false
        return true
      })
      return text({ count: res.length, agents: res })
    }
    case 'get_install_command': {
      const b = bundles[args.id]
      if (!b) return { isError: true, content: [{ type: 'text', text: `Unknown agent: ${args.id}` }] }
      return text({
        install: `npx agentskit add ${args.id}`,
        bundle: `${SITE}/r/${args.id}.json`,
        usage: `import { openai } from '@agentskit/adapters'\nimport { create...Agent } from './agents/${args.id}/agent'`,
      })
    }
    default:
      return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] }
  }
}

function handleRpc(msg: any) {
  const { id, method, params } = msg
  const reply = (result: unknown) => ({ jsonrpc: '2.0', id, result })
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
      if (method?.startsWith('notifications/')) return null // notification: no response
      return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } }
  }
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, mcp-protocol-version',
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS })

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: 'AgentsKit Registry MCP',
        transport: 'streamable-http (JSON-RPC over POST)',
        tools: TOOLS.map((t) => t.name),
        usage: 'POST JSON-RPC 2.0 messages to this endpoint.',
      },
      null,
      2,
    ),
    { headers: { 'content-type': 'application/json', ...CORS } },
  )

export const POST: APIRoute = async ({ request }) => {
  let payload: any
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...CORS },
    })
  }
  const out = Array.isArray(payload)
    ? payload.map(handleRpc).filter(Boolean)
    : handleRpc(payload)
  if (out == null || (Array.isArray(out) && out.length === 0)) {
    return new Response(null, { status: 202, headers: CORS })
  }
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json', ...CORS },
  })
}
