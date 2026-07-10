# Tech Debt Scorer

> **Status: alpha** — installable via `npx agentskit add coding-tech-debt-scorer` for experimentation. Not yet `validated`.

## Pain

Refactor prioritization

## Output

Scored items: impact/effort/risk

## Usage

```ts
import { createCodingTechDebtScorerAgent } from './agents/coding-tech-debt-scorer/agent'
const result = await createCodingTechDebtScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
