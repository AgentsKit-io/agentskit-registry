# Call Prep Brief

> **Status: alpha** — installable via `npx agentskit add sales-call-prep-brief` for experimentation. Not yet `validated`.

## Pain

Unprepared calls

## Output

Brief typed

## Usage

```ts
import { createSalesCallPrepBriefAgent } from './agents/sales-call-prep-brief/agent'
const result = await createSalesCallPrepBriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
