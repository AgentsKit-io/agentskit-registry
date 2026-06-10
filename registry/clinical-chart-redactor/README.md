# Chart Redactor

Applies the hipaa-strict PII profile (names, MRN, dates of birth, contact details) before any cross-tenant export.

```bash
npx agentskit add clinical-chart-redactor
```

```ts
import { openai } from '@agentskit/adapters'
import { createChartRedactorAgent } from './agents/clinical-chart-redactor/agent'

const agent = createChartRedactorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
