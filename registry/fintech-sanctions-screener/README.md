# Sanctions Screener

Screens a customer/counterparty against a sanctions list and decides **clear** vs **escalate** — with the compliance guarantee enforced in **code, not a prompt**.

```bash
npx agentskit add fintech-sanctions-screener
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createSanctionsScreenerAgent } from './agents/fintech-sanctions-screener/agent'

const agent = createSanctionsScreenerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  sanctionsList: ofacSdnNames, // string[] or { name, list?, date? }[] — e.g. an OFAC/UN/EU SDN export
})

const result = await agent.run({ name: 'Vladimir Putin', country: 'RU' })
if (result.requiresHumanSignoff) routeToCompliance(result)
```

Adapter-agnostic — any provider, or run it locally on `claude -p` / `codex`.

## Why it's safe

A naive screener puts "never auto-clear a strong match" in the system prompt — which a hallucinating model can silently violate. This one enforces it in code:

1. **Deterministic match** — `fuzzyMatchList` (Jaro-Winkler, from `@agentskit/core/fuzzy-match`) scores the name against the loaded list. No LLM, no tokens, fully auditable.
2. **Hard rule** — any hit at/above `strongThreshold` (default 0.92) escalates **unconditionally**; the model is never consulted and cannot clear it.
3. **The model only adjudicates weak hits** (`screenThreshold` ≤ score < strong) and can only **downgrade** a fuzzy near-miss to a false positive. A compromised/hallucinating model can therefore only make screening *stricter*, never weaker.
4. **Fail-safe** — if adjudication errors or returns malformed output, the hit is treated as a true match (escalated), not cleared.
5. Untrusted candidate/record text is **fenced** before it reaches the model (prompt-injection mitigation).

## Config

| Option | Purpose |
|--------|---------|
| `sanctionsList` | the list to screen against (names or `{ name, list?, date? }`) |
| `strongThreshold` | auto-escalate floor (default 0.92) — never adjudicated |
| `screenThreshold` | surface-for-adjudication floor (default 0.85) |
| `observers` | live progress / audit (`createProgressObserver()` from `@agentskit/ink`) |
| `memory`, `onConfirm`, `maxSteps` | standard runtime options |

## Output

`run(candidate)` returns a typed `ScreeningResult { candidate, status: 'clear'|'escalate', hits[], requiresHumanSignoff }`; each hit carries `{ matched, list, score, decision, rationale, autoCleared }`. `asHandle()` accepts/returns JSON for orchestration.

See [composing agents](../../COMPOSING.md).
