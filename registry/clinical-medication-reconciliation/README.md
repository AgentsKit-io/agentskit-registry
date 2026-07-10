# Medication Reconciliation

> **Status: alpha** — installable via `npx agentskit add clinical-medication-reconciliation` for experimentation. Not yet `validated`.

## Pain

Med rec errors

## Output

Reconciliation typed

## Usage

```ts
import { createClinicalMedicationReconciliationAgent } from './agents/clinical-medication-reconciliation/agent'
const result = await createClinicalMedicationReconciliationAgent({ adapter }).run(input)
```

## Gates

- safety-net

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
