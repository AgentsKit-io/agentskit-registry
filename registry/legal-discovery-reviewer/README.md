# Discovery Reviewer

Reads documents, highlights privileged + responsive material, drafts case notes for human approval.

```bash
npx agentskit add legal-discovery-reviewer
```

```ts
import { openai } from '@agentskit/adapters'
import { createDiscoveryReviewerAgent } from './agents/legal-discovery-reviewer/agent'

const agent = createDiscoveryReviewerAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
