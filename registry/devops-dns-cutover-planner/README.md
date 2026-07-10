# DNS Cutover Planner

> **Status: alpha** — installable via `npx agentskit add devops-dns-cutover-planner` for experimentation. Not yet `validated`.

## Pain

DNS migrations risky

## Output

Plan typed

## Usage

```ts
import { createDevopsDnsCutoverPlannerAgent } from './agents/devops-dns-cutover-planner/agent'
const result = await createDevopsDnsCutoverPlannerAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
