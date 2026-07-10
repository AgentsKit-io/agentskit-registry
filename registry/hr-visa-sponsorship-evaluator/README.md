# Visa Sponsorship Evaluator

> **Status: alpha** — installable via `npx agentskit add hr-visa-sponsorship-evaluator` for experimentation. Not yet `validated`.

## Pain

Visa eligibility unclear

## Output

Eligibility typed

## Usage

```ts
import { createHrVisaSponsorshipEvaluatorAgent } from './agents/hr-visa-sponsorship-evaluator/agent'
const result = await createHrVisaSponsorshipEvaluatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
