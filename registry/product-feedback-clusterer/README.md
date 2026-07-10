# Feedback Clusterer

> **Status: alpha** — installable via `npx agentskit add product-feedback-clusterer` for experimentation. Not yet `validated`.

## Pain

Feedback scattered

## Output

Clusters typed

## Usage

```ts
import { createProductFeedbackClustererAgent } from './agents/product-feedback-clusterer/agent'
const result = await createProductFeedbackClustererAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
