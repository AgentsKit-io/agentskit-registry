import type { APIRoute } from 'astro'
import { createMcp, type Summary } from '../../lib/mcp'

// On-demand (serverless) — the Vercel adapter ships this as a function.
export const prerender = false

// Bundle the registry JSON into the function (public/ is not on disk at runtime).
const modules = import.meta.glob('/public/r/*.json', { eager: true, import: 'default' }) as Record<string, any>

const index: Summary[] = []
const bundles: Record<string, any> = {}
for (const [path, data] of Object.entries(modules)) {
  const file = path.split('/').pop()!
  if (file === 'index.json') index.push(...(data.agents ?? []))
  else bundles[file.replace(/\.json$/, '')] = data
}

const mcp = createMcp({ index, bundles })

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
        tools: mcp.tools.map((t) => t.name),
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
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }),
      { status: 400, headers: { 'content-type': 'application/json', ...CORS } },
    )
  }
  const out = Array.isArray(payload) ? payload.map((m) => mcp.handleRpc(m)).filter(Boolean) : mcp.handleRpc(payload)
  if (out == null || (Array.isArray(out) && out.length === 0)) {
    return new Response(null, { status: 202, headers: CORS })
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json', ...CORS } })
}
