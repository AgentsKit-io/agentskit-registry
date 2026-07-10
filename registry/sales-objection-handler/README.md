# Objection Handler

> **Status: alpha** — installable via `npx agentskit add sales-objection-handler` for experimentation. Not yet `validated`.

## Pain

Objections ad-hoc

## Output

Responses typed

## Usage

```ts
import { createSalesObjectionHandlerAgent } from './agents/sales-objection-handler/agent'
const result = await createSalesObjectionHandlerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
