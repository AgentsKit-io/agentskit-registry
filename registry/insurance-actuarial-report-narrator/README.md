# Actuarial Report Narrator

> **Status: alpha** — installable via `npx agentskit add insurance-actuarial-report-narrator` for experimentation. Not yet `validated`.

## Pain

Actuarial opaque

## Output

Narrative typed

## Usage

```ts
import { createInsuranceActuarialReportNarratorAgent } from './agents/insurance-actuarial-report-narrator/agent'
const result = await createInsuranceActuarialReportNarratorAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
