# Postmortem Action Tracker

> **Status: alpha** — installable via `npx agentskit add ops-postmortem-action-tracker` for experimentation. Not yet `validated`.

## Pain

PM actions not done

## Output

Tracker typed

## Usage

```ts
import { createOpsPostmortemActionTrackerAgent } from './agents/ops-postmortem-action-tracker/agent'
const result = await createOpsPostmortemActionTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
