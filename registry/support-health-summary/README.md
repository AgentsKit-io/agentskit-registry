# Account Health Summary

> **Status: alpha** — installable via `npx agentskit add support-health-summary` for experimentation. Not yet `validated`.

## Pain

Account reviews manual

## Output

Health summary typed

## Usage

```ts
import { createSupportHealthSummaryAgent } from './agents/support-health-summary/agent'
const result = await createSupportHealthSummaryAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
