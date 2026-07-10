# Billing Code Suggester

> **Status: alpha** — installable via `npx agentskit add clinical-billing-code-suggester` for experimentation. Not yet `validated`.

## Pain

Coding errors

## Output

ICD/CPT suggestions typed

## Usage

```ts
import { createClinicalBillingCodeSuggesterAgent } from './agents/clinical-billing-code-suggester/agent'
const result = await createClinicalBillingCodeSuggesterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
