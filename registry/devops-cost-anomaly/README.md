# Cost Anomaly

> **Status: alpha** — installable via `npx agentskit add devops-cost-anomaly` for experimentation. Not yet `validated`.

## Pain

Cloud cost spikes

## Output

Anomaly typed

## Usage

```ts
import { createDevopsCostAnomalyAgent } from './agents/devops-cost-anomaly/agent'
const result = await createDevopsCostAnomalyAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
