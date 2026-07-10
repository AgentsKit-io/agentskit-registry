# ETL Failure Diagnoser

> **Status: alpha** — installable via `npx agentskit add data-etl-failure-diagnoser` for experimentation. Not yet `validated`.

## Pain

ETL failures opaque

## Output

Diagnosis typed

## Usage

```ts
import { createDataEtlFailureDiagnoserAgent } from './agents/data-etl-failure-diagnoser/agent'
const result = await createDataEtlFailureDiagnoserAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
