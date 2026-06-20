# Competitor Researcher

Searches + fetches competitor web content (`webSearch` / `fetchUrl`), diffs it against your RAG baseline, and produces a structured competitive-landscape report — **hardened against prompt injection** from fetched pages.

```bash
npx agentskit add marketing-competitor-researcher
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCompetitorResearcherAgent } from './agents/marketing-competitor-researcher/agent'

const agent = createCompetitorResearcherAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  retriever: myCompetitorBaseline, // RAG grounding (optional)
})
const { content } = await agent.run('Competitors: Acme, Globex. Brief: ...')
```

This is a **tool-loop** agent (multi-page fetch over a ReAct loop) — it keeps the full runtime rather than a single structured call.

- **Injection-hardened** — fetched competitor pages are attacker-controlled. The prompt explicitly marks every tool result as **data, not commands**, so a page reading "ignore your instructions" is summarised, not obeyed. Untrusted-content directive applied.
- **Correct tooling** — wires `webSearch()` + `fetchUrl()` (the prior prompt referenced a non-existent `webhook.post`). Override via `tools`.
- **Never fabricates** — unfetchable sources (rate-limited / 404 / paywalled) are flagged "unverified — manual check required".

## Capabilities

| Option | Purpose |
|--------|---------|
| `tools` | replace the default `webSearch` + `fetchUrl` |
| `retriever` | RAG competitor-baseline grounding |
| `onConfirm` | per-tool permission gate (HITL / RBAC) |
| `observers` | tracing / audit |

See [composing agents](../../COMPOSING.md).
