# AML Monitor

Evaluates AML findings against the aml-thresholds RAG and produces a structured alert with tier classification (CTR / SAR-draft / monitor) ready for compliance-team review.

```bash
npx agentskit add casino-aml-monitor
```

```ts
import { openai } from '@agentskit/adapters'
import { createAmlMonitorAgent } from './agents/casino-aml-monitor/agent'

const agent = createAmlMonitorAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
