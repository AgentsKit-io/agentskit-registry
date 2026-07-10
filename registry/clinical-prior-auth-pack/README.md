# Prior Auth Pack

> **Status: alpha** — installable via `npx agentskit add clinical-prior-auth-pack` for experimentation. Not yet `validated`.

## Pain

Prior auth paperwork

## Output

Pack draft typed

## Usage

```ts
import { createClinicalPriorAuthPackAgent } from './agents/clinical-prior-auth-pack/agent'
const result = await createClinicalPriorAuthPackAgent({ adapter }).run(input)
```

## Gates

- hitl
- draft
- never-diagnose

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
