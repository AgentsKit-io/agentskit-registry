# dbt Model Reviewer

> **Status: alpha** — installable via `npx agentskit add data-dbt-model-reviewer` for experimentation. Not yet `validated`.

## Pain

dbt quality issues

## Output

Findings typed

## Usage

```ts
import { createDataDbtModelReviewerAgent } from './agents/data-dbt-model-reviewer/agent'
const result = await createDataDbtModelReviewerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
