# SQL Reviewer

> **Status: alpha** — installable via `npx agentskit add data-sql-reviewer` for experimentation. Not yet `validated`.

## Pain

Unsafe SQL

## Output

Findings typed

## Usage

```ts
import { createDataSqlReviewerAgent } from './agents/data-sql-reviewer/agent'
const result = await createDataSqlReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
