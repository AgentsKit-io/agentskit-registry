# Sanctions Screener

Continuously cross-references customer + counterparty records against OFAC, UN, EU, and locally-loaded sanctions lists.

```bash
npx agentskit add fintech-sanctions-screener
```

```ts
import { openai } from '@agentskit/adapters'
import { createSanctionsScreenerAgent } from './agents/fintech-sanctions-screener/agent'

const agent = createSanctionsScreenerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
