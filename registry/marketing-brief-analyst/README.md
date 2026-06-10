# Brief Analyst

Reads campaign briefs and extracts structured objectives, audience segments, key messages, and success metrics. Anchors all downstream work to brand voice and persona knowledge.

```bash
npx agentskit add marketing-brief-analyst
```

```ts
import { openai } from '@agentskit/adapters'
import { createBriefAnalystAgent } from './agents/marketing-brief-analyst/agent'

const agent = createBriefAnalystAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
const { content } = await agent.run('…')
```

Swap the adapter for any provider — no lock-in.

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
