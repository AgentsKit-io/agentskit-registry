# Capacity Forecaster

> **Status: alpha** — installable via `npx agentskit add devops-capacity-forecaster` for experimentation. Not yet `validated`.

## Pain

Capacity surprises

## Output

Forecast typed

## Usage

```ts
import { createDevopsCapacityForecasterAgent } from './agents/devops-capacity-forecaster/agent'
const result = await createDevopsCapacityForecasterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
