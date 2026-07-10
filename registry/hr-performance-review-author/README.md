# Performance Review Author

> **Status: alpha** — installable via `npx agentskit add hr-performance-review-author` for experimentation. Not yet `validated`.

## Pain

Reviews slow

## Output

Review draft typed

## Usage

```ts
import { createHrPerformanceReviewAuthorAgent } from './agents/hr-performance-review-author/agent'
const result = await createHrPerformanceReviewAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
