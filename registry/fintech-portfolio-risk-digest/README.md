# Portfolio Risk Digest

> **Status: alpha** — installable via `npx agentskit add fintech-portfolio-risk-digest` for experimentation. Not yet `validated`.

## Pain

Risk reporting manual

## Output

Digest typed

## Usage

```ts
import { createFintechPortfolioRiskDigestAgent } from './agents/fintech-portfolio-risk-digest/agent'
const result = await createFintechPortfolioRiskDigestAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
