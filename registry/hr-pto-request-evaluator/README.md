# PTO Request Evaluator

> **Status: alpha** — installable via `npx agentskit add hr-pto-request-evaluator` for experimentation. Not yet `validated`.

## Pain

PTO policy inconsistent

## Output

Decision typed

## Usage

```ts
import { createHrPtoRequestEvaluatorAgent } from './agents/hr-pto-request-evaluator/agent'
const result = await createHrPtoRequestEvaluatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
