# Change Request Reviewer

> **Status: alpha** — installable via `npx agentskit add ops-change-request-reviewer` for experimentation. Not yet `validated`.

## Pain

Change risk unclear

## Output

Review typed

## Usage

```ts
import { createOpsChangeRequestReviewerAgent } from './agents/ops-change-request-reviewer/agent'
const result = await createOpsChangeRequestReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
