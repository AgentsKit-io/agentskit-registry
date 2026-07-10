# Covenant Monitor

> **Status: alpha** — installable via `npx agentskit add fintech-covenant-monitor` for experimentation. Not yet `validated`.

## Pain

Loan covenant breaches

## Output

Breach flags typed

## Usage

```ts
import { createFintechCovenantMonitorAgent } from './agents/fintech-covenant-monitor/agent'
const result = await createFintechCovenantMonitorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
