# Inspection Summarizer

> **Status: alpha** — installable via `npx agentskit add realestate-inspection-report-summarizer` for experimentation. Not yet `validated`.

## Pain

Inspection reports long

## Output

Summary typed

## Usage

```ts
import { createRealestateInspectionReportSummarizerAgent } from './agents/realestate-inspection-report-summarizer/agent'
const result = await createRealestateInspectionReportSummarizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
