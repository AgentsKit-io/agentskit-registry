# Report Narrator

> **Status: alpha** — installable via `npx agentskit add data-report-narrator` for experimentation. Not yet `validated`.

## Pain

Reports need narrative

## Output

Narrative typed

## Usage

```ts
import { createDataReportNarratorAgent } from './agents/data-report-narrator/agent'
const result = await createDataReportNarratorAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
