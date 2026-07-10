# Lead Scorer

> **Status: alpha** — installable via `npx agentskit add sales-lead-scorer` for experimentation. Not yet `validated`.

## Pain

Lead qual inconsistent

## Output

Score typed

## Usage

```ts
import { createSalesLeadScorerAgent } from './agents/sales-lead-scorer/agent'
const result = await createSalesLeadScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
