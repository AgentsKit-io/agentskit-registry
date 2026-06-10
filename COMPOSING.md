# Composing agents — tools, RAG, MCP, permissions, orchestration

Every registry agent is a portable "brain" (a skill) with a capability-rich
factory. All config is **optional** — the zero-config form still runs. This guide
shows how to wire the full AgentsKit runtime.

## Config surface

```ts
createXAgent({
  adapter,                       // required: any AgentsKit adapter
  tools,                         // ToolDefinition[] — tools / integrations / MCP
  memory,                        // ChatMemory — conversation context / persistence
  retriever,                     // Retriever — RAG grounding
  delegates,                     // Record<string, DelegateConfig> — sub-agents
  onConfirm,                     // (toolCall) => boolean — per-tool permission (HITL/RBAC)
  observers,                     // Observer[] — tracing / audit
  maxSteps,
})
```

## Tools & integrations

```ts
import { webSearch, fetchUrl } from '@agentskit/tools'
import { github } from '@agentskit/tools/integrations'

createResearchAgent({ adapter, tools: [webSearch(), fetchUrl()] })
createPRReviewAgent({ adapter, tools: [...github({ token })] })
```

## MCP (use any MCP server's tools)

```ts
import { createMcpClient, toolsFromMcpClient } from '@agentskit/tools/mcp'

const client = await createMcpClient({ /* transport */ })
const tools = await toolsFromMcpClient(client)
createXAgent({ adapter, tools })
```

## RAG (ground answers in your data)

```ts
import { createRAG } from '@agentskit/rag'

const rag = await createRAG({ store, embedder })
createXAgent({ adapter, retriever: rag.retrieve })
```

## Permissions (HITL / RBAC)

```ts
createXAgent({
  adapter,
  tools: [...],
  onConfirm: async (toolCall) => askHuman(toolCall),  // approve/deny each tool call
})
```

## Orchestration (multi-agent)

Agents expose `name`; their `run` returns a `RunResult`. Topologies expect a
handle whose `run` returns a string, so wrap once:

```ts
import { supervisor } from '@agentskit/runtime'

const toHandle = (a) => ({ name: a.name, run: (t) => a.run(t).then((r) => r.content) })

const kyc = createKycScreenerAgent({ adapter })
const fraud = createFraudInvestigatorAgent({ adapter })
const lead = createTransactionMonitorAgent({ adapter })

const team = supervisor({
  supervisor: toHandle(lead),
  workers: [toHandle(kyc), toHandle(fraud)],
})
await team.run('Investigate account 8842 for the last 30 days')
```

`swarm`, `hierarchical`, and `blackboard` follow the same handle shape.

## Observability

```ts
createXAgent({ adapter, observers: [myTracer] })  // LangSmith / OTel / console
```

---

In **AKOS**, these same config slots are filled by the enterprise control plane —
egress-wrapped tools, the RBAC `onConfirm` gate, the hosted orchestrator
(`delegates`), and the audit ledger (`observers`). The OSS agent is the portable
brain; AKOS wraps it. See RFC 0003.
