# Telehealth Intake

> **Status: alpha** — installable via `npx agentskit add clinical-telehealth-intake` for experimentation. Not yet `validated`.

## Pain

Telehealth intake unstructured

## Output

Intake typed

## Usage

```ts
import { createClinicalTelehealthIntakeAgent } from './agents/clinical-telehealth-intake/agent'
const result = await createClinicalTelehealthIntakeAgent({ adapter }).run(input)
```

## Gates

- triage-net

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
