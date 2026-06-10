# Calendar Digest Author

Aggregates scheduled social posts for the week and produces a digest summary for Slack. Used by the social-calendar satellite flow.

```bash
npx agentskit add marketing-calendar-digest-author
```

```ts
import { openai } from '@agentskit/adapters'
import { createCalendarDigestAuthorAgent } from './agents/marketing-calendar-digest-author/agent'

const agent = createCalendarDigestAuthorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
