# Internal Link Planner

> **Status: alpha** — installable via `npx agentskit add content-internal-link-planner` for experimentation. Not yet `validated`.

## Pain

Internal linking weak

## Output

Plan typed

## Usage

```ts
import { createContentInternalLinkPlannerAgent } from './agents/content-internal-link-planner/agent'
const result = await createContentInternalLinkPlannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
