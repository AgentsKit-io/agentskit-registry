# Beta Feedback Triage

> **Status: alpha** — installable via `npx agentskit add product-beta-feedback-triage` for experimentation. Not yet `validated`.

## Pain

Beta noise

## Output

Triage typed

## Usage

```ts
import { createProductBetaFeedbackTriageAgent } from './agents/product-beta-feedback-triage/agent'
const result = await createProductBetaFeedbackTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
