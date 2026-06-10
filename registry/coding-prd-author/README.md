# PRD Author

Transforms free-form product descriptions into structured, acceptance-criteria-driven PRDs ready for engineering hand-off.

```bash
npx agentskit add coding-prd-author
```

```ts
import { openai } from '@agentskit/adapters'
import { createPrdAuthorAgent } from './agents/coding-prd-author/agent'

const agent = createPrdAuthorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
