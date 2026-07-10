# Beneficiary Verifier

> **Status: alpha** — installable via `npx agentskit add insurance-beneficiary-verifier` for experimentation. Not yet `validated`.

## Pain

Beneficiary errors

## Output

Verification typed

## Usage

```ts
import { createInsuranceBeneficiaryVerifierAgent } from './agents/insurance-beneficiary-verifier/agent'
const result = await createInsuranceBeneficiaryVerifierAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
