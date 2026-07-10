# Accommodation Evaluator

> **Status: alpha** — installable via `npx agentskit add education-accommodation-evaluator` for experimentation. Not yet `validated`.

## Pain

Accommodations

## Output

Evaluation typed

## Usage

```ts
import { createEducationAccommodationEvaluatorAgent } from './agents/education-accommodation-evaluator/agent'
const result = await createEducationAccommodationEvaluatorAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
