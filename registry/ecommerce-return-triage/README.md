# Return Triage

> **Status: alpha** — installable via `npx agentskit add ecommerce-return-triage` for experimentation. Not yet `validated`.

## Pain

Returns slow

## Output

Triage typed

## Usage

```ts
import { createEcommerceReturnTriageAgent } from './agents/ecommerce-return-triage/agent'
const result = await createEcommerceReturnTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
