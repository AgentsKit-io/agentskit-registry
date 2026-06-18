import type { APIRoute } from 'astro'
import { getIndex } from '../../data/registry'

const SITE = 'https://registry.agentskit.io'

// Lightweight discovery document so agent runtimes can find the registry + its
// MCP endpoint without prior knowledge. Served at /.well-known/mcp.json.
export const GET: APIRoute = () => {
  const body = {
    schemaVersion: 1,
    name: 'AgentsKit Registry',
    description: 'Ready-to-use AI agents for AgentsKit. Copy the source, own the code.',
    homepage: SITE,
    mcp: {
      endpoint: `${SITE}/api/mcp`,
      transport: 'streamable-http',
      tools: ['list_agents', 'get_agent', 'search_agents', 'get_install_command'],
    },
    resources: {
      index: `${SITE}/r/index.json`,
      agentBundle: `${SITE}/r/{id}.json`,
      agentMarkdown: `${SITE}/agents/{id}.md`,
      llms: `${SITE}/llms.txt`,
      llmsFull: `${SITE}/llms-full.txt`,
    },
    counts: { agents: getIndex().length },
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  })
}
