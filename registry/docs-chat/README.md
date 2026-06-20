# Docs Chat

Provider-agnostic "chat over your docs" — grounded RAG answers drawn strictly
from your own documentation. The agent answers only from the pages your
retriever returns; when something is not covered it says so and points at the
nearest page instead of inventing an answer.

```bash
npx agentskit add docs-chat
```

## Wire a retriever (RAG)

Ground the agent in your docs by passing a `retriever`. The easiest path is
[`@agentskit/rag`](https://www.npmjs.com/package/@agentskit/rag) over a
[`@agentskit/memory`](https://www.npmjs.com/package/@agentskit/memory) vector
store:

```ts
import { createRAG } from '@agentskit/rag'
import { lanceMemory } from '@agentskit/memory'
import { openrouter } from '@agentskit/adapters'
import { createDocsChatAgent } from './agents/docs-chat/agent'

// Index your docs into a vector store, then expose a retriever.
const store = lanceMemory({ path: './.docs-index' })
const rag = await createRAG({ store, embedder })

const agent = createDocsChatAgent({
  adapter: openrouter({ apiKey: process.env.OPENROUTER_API_KEY!, model: 'meta-llama/llama-3.1-8b-instruct:free' }),
  retriever: rag.retrieve,
})

const { content } = await agent.run('How do I configure memory?')
```

## Bring your own adapter

The agent is provider-agnostic — pass any AgentsKit adapter. Use a free
OpenRouter model to start, or swap in OpenAI, Anthropic, Gemini, Ollama, etc.
with zero code changes:

```ts
import { openai } from '@agentskit/adapters'
const agent = createDocsChatAgent({
  adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }),
  retriever: rag.retrieve,
})
```

> Grounding quality scales with model quality: a stronger model follows the
> "answer only from context" instruction more reliably and writes tighter,
> better-cited answers. The retriever decides *what* the model sees; the model
> decides how faithfully it stays within it.

## Capabilities

The factory accepts optional config to wire the full runtime — all optional,
zero-config still works:

| Option | Purpose |
|--------|---------|
| `retriever` | RAG grounding — the user's docs (e.g. `createRAG().retrieve`) |
| `tools` | tools, integrations, or MCP tools (`toolsFromMcpClient`) |
| `memory` | conversation context / persistence |
| `delegates` | sub-agents to delegate to |
| `onConfirm` | per-tool permission gate (HITL / RBAC) |
| `observers` | tracing / audit |
| `systemPrompt` | override the default grounded docs-assistant prompt |

See [composing agents](../../COMPOSING.md) — tools, RAG, MCP, permissions, and
multi-agent orchestration.
