# Vendor Evaluation

> **Status: alpha** — installable via `npx agentskit add research-vendor-evaluation` for experimentation. Not yet `validated`.

## Pain

Vendor selection subjective

## Output

Scorecard typed + evidence

## Usage

```ts
import { createResearchVendorEvaluationAgent } from './agents/research-vendor-evaluation/agent'
const result = await createResearchVendorEvaluationAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
