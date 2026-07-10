# Log Anomaly

> **Status: alpha** — installable via `npx agentskit add security-log-anomaly` for experimentation. Not yet `validated`.

## Pain

Log anomalies

## Output

Anomalies typed

## Usage

```ts
import { createSecurityLogAnomalyAgent } from './agents/security-log-anomaly/agent'
const result = await createSecurityLogAnomalyAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
