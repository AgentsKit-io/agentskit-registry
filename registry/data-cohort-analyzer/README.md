# Cohort Analyzer

> **Status: alpha** — installable via `npx agentskit add data-cohort-analyzer` for experimentation. Not yet `validated`.

## Pain

Cohort analysis slow

## Output

Insights typed

## Usage

```ts
import { createDataCohortAnalyzerAgent } from './agents/data-cohort-analyzer/agent'
const result = await createDataCohortAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
