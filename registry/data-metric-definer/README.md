# Metric Definer

> **Status: alpha** — installable via `npx agentskit add data-metric-definer` for experimentation. Not yet `validated`.

## Pain

Metric definitions vague

## Output

Definition typed

## Usage

```ts
import { createDataMetricDefinerAgent } from './agents/data-metric-definer/agent'
const result = await createDataMetricDefinerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
