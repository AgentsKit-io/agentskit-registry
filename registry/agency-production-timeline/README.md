# Production Timeline

> **Status: alpha** — installable via `npx agentskit add agency-production-timeline` for experimentation. Not yet `validated`.

## Pain

Timelines chaotic

## Output

Timeline typed

## Usage

```ts
import { createAgencyProductionTimelineAgent } from './agents/agency-production-timeline/agent'
const result = await createAgencyProductionTimelineAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
