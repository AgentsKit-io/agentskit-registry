# Medical Record Summarizer

> **Status: alpha** — installable via `npx agentskit add insurance-medical-record-summarizer` for experimentation. Not yet `validated`.

## Pain

Med records long

## Output

Summary typed

## Usage

```ts
import { createInsuranceMedicalRecordSummarizerAgent } from './agents/insurance-medical-record-summarizer/agent'
const result = await createInsuranceMedicalRecordSummarizerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
