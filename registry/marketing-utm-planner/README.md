# UTM Planner

> **Status: alpha** — installable via `npx agentskit add marketing-utm-planner` for experimentation. Not yet `validated`.

## Pain

UTM chaos

## Output

Campaign map typed

## Usage

```ts
import { createMarketingUtmPlannerAgent } from './agents/marketing-utm-planner/agent'
const result = await createMarketingUtmPlannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
