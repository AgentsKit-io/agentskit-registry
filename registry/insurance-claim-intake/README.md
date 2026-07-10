# Claim Intake

> **Status: alpha** — installable via `npx agentskit add insurance-claim-intake` for experimentation. Not yet `validated`.

## Pain

Claim intake slow

## Output

Intake typed

## Usage

```ts
import { createInsuranceClaimIntakeAgent } from './agents/insurance-claim-intake/agent'
const result = await createInsuranceClaimIntakeAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
