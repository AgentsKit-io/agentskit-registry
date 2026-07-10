# Adverse Event Reporter

> **Status: alpha** — installable via `npx agentskit add clinical-adverse-event-reporter` for experimentation. Not yet `validated`.

## Pain

AE reporting slow

## Output

Report draft typed

## Usage

```ts
import { createClinicalAdverseEventReporterAgent } from './agents/clinical-adverse-event-reporter/agent'
const result = await createClinicalAdverseEventReporterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
