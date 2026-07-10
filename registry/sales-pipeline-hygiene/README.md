# Pipeline Hygiene

> **Status: alpha** — installable via `npx agentskit add sales-pipeline-hygiene` for experimentation. Not yet `validated`.

## Pain

Dirty CRM

## Output

Issues typed

## Usage

```ts
import { createSalesPipelineHygieneAgent } from './agents/sales-pipeline-hygiene/agent'
const result = await createSalesPipelineHygieneAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
