# Competitor Researcher

Fetches competitor web content via webhook.post, diffs it against the RAG competitor baseline, and produces a structured competitive landscape summary with positioning gaps and messaging opportunities.

```bash
npx agentskit add marketing-competitor-researcher
```

```ts
import { openai } from '@agentskit/adapters'
import { createCompetitorResearcherAgent } from './agents/marketing-competitor-researcher/agent'

const agent = createCompetitorResearcherAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in. **Deploy on AKOS — coming soon** → https://akos.agentskit.io

## Capabilities

The factory accepts optional config to wire the full runtime — all optional, zero-config still works:

| Option | Purpose |
|--------|---------|
| `tools` | tools, integrations, or MCP tools (`toolsFromMcpClient`) |
| `memory` | conversation context / persistence |
| `retriever` | RAG grounding |
| `delegates` | sub-agents to delegate to |
| `onConfirm` | per-tool permission gate (HITL / RBAC) |
| `observers` | tracing / audit |

See [composing agents](../../COMPOSING.md) — tools, RAG, MCP, permissions, and multi-agent orchestration.
