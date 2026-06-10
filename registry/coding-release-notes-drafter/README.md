# Release Notes Drafter

Drafts release notes from the merged PRs since the last tag.

```bash
npx agentskit add coding-release-notes-drafter
```

```ts
import { openai } from '@agentskit/adapters'
import { createReleaseNotesDrafterAgent } from './agents/coding-release-notes-drafter/agent'

const agent = createReleaseNotesDrafterAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
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
