# Database Query Reviewer

> **Status: alpha** — installable via `npx agentskit add coding-database-query-reviewer` for experimentation. Not yet `validated`.

## Pain

N+1 and missing indexes

## Output

SQL findings typed

## Usage

```ts
import { createCodingDatabaseQueryReviewerAgent } from './agents/coding-database-query-reviewer/agent'
const result = await createCodingDatabaseQueryReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
