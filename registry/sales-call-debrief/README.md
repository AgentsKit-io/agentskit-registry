# Call Debrief

> **Status: alpha** — installable via `npx agentskit add sales-call-debrief` for experimentation. Not yet `validated`.

## Pain

Call notes unstructured

## Output

Debrief typed

## Usage

```ts
import { createSalesCallDebriefAgent } from './agents/sales-call-debrief/agent'
const result = await createSalesCallDebriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
