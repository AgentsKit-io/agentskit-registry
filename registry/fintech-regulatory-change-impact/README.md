# Regulatory Change Impact

> **Status: alpha** — installable via `npx agentskit add fintech-regulatory-change-impact` for experimentation. Not yet `validated`.

## Pain

Reg changes impact unclear

## Output

Impact typed

## Usage

```ts
import { createFintechRegulatoryChangeImpactAgent } from './agents/fintech-regulatory-change-impact/agent'
const result = await createFintechRegulatoryChangeImpactAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
