# Lease Reviewer

> **Status: alpha** — installable via `npx agentskit add realestate-lease-reviewer` for experimentation. Not yet `validated`.

## Pain

Lease review slow

## Output

Findings typed

## Usage

```ts
import { createRealestateLeaseReviewerAgent } from './agents/realestate-lease-reviewer/agent'
const result = await createRealestateLeaseReviewerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
