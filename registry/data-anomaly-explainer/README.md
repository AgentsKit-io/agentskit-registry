# Anomaly Explainer

> **Status: alpha** — installable via `npx agentskit add data-anomaly-explainer` for experimentation. Not yet `validated`.

## Pain

Anomalies unexplained

## Output

Explanation typed

## Usage

```ts
import { createDataAnomalyExplainerAgent } from './agents/data-anomaly-explainer/agent'
const result = await createDataAnomalyExplainerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
