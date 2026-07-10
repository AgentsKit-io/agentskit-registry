# Refund Evaluator

> **Status: alpha** — installable via `npx agentskit add support-refund-evaluator` for experimentation. Not yet `validated`.

## Pain

Refund decisions inconsistent

## Output

Decision + rationale typed

## Usage

```ts
import { createSupportRefundEvaluatorAgent } from './agents/support-refund-evaluator/agent'
const result = await createSupportRefundEvaluatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
