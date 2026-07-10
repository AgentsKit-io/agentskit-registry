# SLO Breach Analyzer

> **Status: alpha** — installable via `npx agentskit add devops-slo-breach-analyzer` for experimentation. Not yet `validated`.

## Pain

SLO misses unexplained

## Output

Analysis typed

## Usage

```ts
import { createDevopsSloBreachAnalyzerAgent } from './agents/devops-slo-breach-analyzer/agent'
const result = await createDevopsSloBreachAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
