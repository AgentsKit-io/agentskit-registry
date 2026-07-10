# Win/Loss Analyzer

> **Status: alpha** — installable via `npx agentskit add sales-win-loss-analyzer` for experimentation. Not yet `validated`.

## Pain

Win/loss insights missing

## Output

Analysis typed

## Usage

```ts
import { createSalesWinLossAnalyzerAgent } from './agents/sales-win-loss-analyzer/agent'
const result = await createSalesWinLossAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
