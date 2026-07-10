# Trial Eligibility

> **Status: alpha** — installable via `npx agentskit add clinical-trial-eligibility` for experimentation. Not yet `validated`.

## Pain

Trial matching manual

## Output

Eligibility typed

## Usage

```ts
import { createClinicalTrialEligibilityAgent } from './agents/clinical-trial-eligibility/agent'
const result = await createClinicalTrialEligibilityAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
