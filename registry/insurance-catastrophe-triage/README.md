# Catastrophe Triage

> **Status: alpha** — installable via `npx agentskit add insurance-catastrophe-triage` for experimentation. Not yet `validated`.

## Pain

Cat event volume

## Output

Triage typed

## Usage

```ts
import { createInsuranceCatastropheTriageAgent } from './agents/insurance-catastrophe-triage/agent'
const result = await createInsuranceCatastropheTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
