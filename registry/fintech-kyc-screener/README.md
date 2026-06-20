# KYC Screener

Onboarding identity screen against sanctions / PEP / adverse-media lists — with the compliance guarantee enforced in **code, not a prompt**.

```bash
npx agentskit add fintech-kyc-screener
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createKycScreenerAgent } from './agents/fintech-kyc-screener/agent'

const agent = createKycScreenerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  lists: [{ name: 'Vladimir Putin', list: 'PEP' }, ...sanctionsNames.map((name) => ({ name, list: 'OFAC-SDN' }))],
})

const r = await agent.run({ name: 'Jane Doe', dob: '1980-02-02', country: 'US' })
if (r.requiresHumanSignoff) routeToCompliance(r)
```

## Why it's safe

1. **Required fields validated up front** — refuses (and reports the missing field) when `name`/`dob`/`country` are absent; never guesses.
2. **Deterministic match** — `fuzzyMatchList` (Jaro-Winkler) scores the name against the loaded list. No LLM, auditable.
3. **Hard rule** — score ≥ `strongThreshold` (0.92) escalates **unconditionally**; the model can't clear it.
4. **Model only adjudicates weak hits** and can only **downgrade** → a hallucinating model only makes screening stricter.
5. **Fail-safe** — failed/malformed adjudication → escalate. Untrusted candidate text is **fenced**.

## Config

| Option | Purpose |
|--------|---------|
| `lists` | combined screening list; tag each entry's source via `list` (`OFAC-SDN`/`PEP`/`ADVERSE-MEDIA`/…) |
| `strongThreshold` / `screenThreshold` | escalate / adjudication floors (0.92 / 0.85) |
| `observers`, `memory`, `onConfirm`, `maxSteps` | standard runtime options |

`run(candidate)` → typed `KycResult { candidate, riskTier: 'clear'|'escalate', hits[], requiresHumanSignoff, missing? }`. `asHandle()` is JSON-in/JSON-out.

See [composing agents](../../COMPOSING.md). Sibling: [`fintech-sanctions-screener`](../fintech-sanctions-screener) (same gate, ongoing single-list screening).
