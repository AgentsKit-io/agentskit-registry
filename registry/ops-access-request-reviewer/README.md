# Access Request Reviewer

> **Status: alpha** — installable via `npx agentskit add ops-access-request-reviewer` for experimentation. Not yet `validated`.

## Pain

Access grants risky

## Output

Review typed

## Usage

```ts
import { createOpsAccessRequestReviewerAgent } from './agents/ops-access-request-reviewer/agent'
const result = await createOpsAccessRequestReviewerAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
