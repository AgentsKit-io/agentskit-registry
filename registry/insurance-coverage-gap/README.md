# Coverage Gap

> **Status: alpha** — installable via `npx agentskit add insurance-coverage-gap` for experimentation. Not yet `validated`.

## Pain

Coverage gaps

## Output

Gaps typed

## Usage

```ts
import { createInsuranceCoverageGapAgent } from './agents/insurance-coverage-gap/agent'
const result = await createInsuranceCoverageGapAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
