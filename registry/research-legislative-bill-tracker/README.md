# Legislative Bill Tracker

> **Status: alpha** — installable via `npx agentskit add research-legislative-bill-tracker` for experimentation. Not yet `validated`.

## Pain

Bill status tracking

## Output

Status typed + bill ref

## Usage

```ts
import { createResearchLegislativeBillTrackerAgent } from './agents/research-legislative-bill-tracker/agent'
const result = await createResearchLegislativeBillTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
