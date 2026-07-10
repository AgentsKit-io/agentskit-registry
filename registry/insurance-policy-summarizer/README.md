# Policy Summarizer

> **Status: alpha** — installable via `npx agentskit add insurance-policy-summarizer` for experimentation. Not yet `validated`.

## Pain

Policies long

## Output

Summary typed

## Usage

```ts
import { createInsurancePolicySummarizerAgent } from './agents/insurance-policy-summarizer/agent'
const result = await createInsurancePolicySummarizerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
