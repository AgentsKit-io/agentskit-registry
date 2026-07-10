# Discharge Summary

> **Status: alpha** — installable via `npx agentskit add clinical-discharge-summary` for experimentation. Not yet `validated`.

## Pain

Discharge docs slow

## Output

Summary typed

## Usage

```ts
import { createClinicalDischargeSummaryAgent } from './agents/clinical-discharge-summary/agent'
const result = await createClinicalDischargeSummaryAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
