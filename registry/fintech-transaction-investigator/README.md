# Transaction Investigator

Scans a transaction history for anomalous patterns and drafts a **typed case file** — `fraud` or `aml` (SAR-ready) mode. Always a draft for a human; never an enforcement action.

```bash
npx agentskit add fintech-transaction-investigator
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createTransactionInvestigatorAgent } from './agents/fintech-transaction-investigator/agent'

const r = await createTransactionInvestigatorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  mode: 'aml', // or 'fraud'
}).run(transactionHistory)
// → { findings: Finding[], summary, highestSeverity, insufficientEvidence, requiresHumanReview }
```

> Replaces the two near-duplicate single-prompt agents `fintech-fraud-investigator` and `fintech-transaction-monitor` with one configurable, typed agent.

- **Canonical `Finding[]`** — `invokeStructured` + zod against `@agentskit/core/finding`. Each finding cites the transaction IDs (`location`), the pattern tripped (`category`), a severity, and a next step (`remediation`) — interoperable with dashboards, eval scorers, and AKOS steps.
- **Always a draft** — `requiresHumanReview` is always true; never freezes accounts or files SARs. `highestSeverity` summarises the case.
- **No over-claiming / fail-safe** — ambiguous evidence ⇒ `insufficientEvidence`; an unparseable model response ⇒ `insufficientEvidence:true` with zero findings, **never** a silent all-clear.
- Untrusted transaction text is **fenced**; compliance footer enforced.

`run(history)` → `InvestigationResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Pairs with [`fintech-sanctions-screener`](../fintech-sanctions-screener) and [`fintech-kyc-screener`](../fintech-kyc-screener).
