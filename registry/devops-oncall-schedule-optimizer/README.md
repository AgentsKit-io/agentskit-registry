# On-call Schedule Optimizer

> **Status: alpha** — installable via `npx agentskit add devops-oncall-schedule-optimizer` for experimentation. Not yet `validated`.

## Pain

Unfair on-call

## Output

Schedule typed

## Usage

```ts
import { createDevopsOncallScheduleOptimizerAgent } from './agents/devops-oncall-schedule-optimizer/agent'
const result = await createDevopsOncallScheduleOptimizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
