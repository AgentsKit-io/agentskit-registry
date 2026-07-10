# Sales to CS Handoff

> **Status: alpha** — installable via `npx agentskit add sales-handoff-to-cs` for experimentation. Not yet `validated`.

## Pain

Sales→CS context loss

## Output

Handoff typed

## Usage

```ts
import { createSalesHandoffToCsAgent } from './agents/sales-handoff-to-cs/agent'
const result = await createSalesHandoffToCsAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
