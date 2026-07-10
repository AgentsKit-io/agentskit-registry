# Insurance Claim Triage

> **Status: alpha** — installable via `npx agentskit add fintech-insurance-claim-triage` for experimentation. Not yet `validated`.

## Pain

Claim intake slow

## Output

Triage typed

## Usage

```ts
import { createFintechInsuranceClaimTriageAgent } from './agents/fintech-insurance-claim-triage/agent'
const result = await createFintechInsuranceClaimTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
