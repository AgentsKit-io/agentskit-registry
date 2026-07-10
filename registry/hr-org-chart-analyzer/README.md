# Org Chart Analyzer

> **Status: alpha** — installable via `npx agentskit add hr-org-chart-analyzer` for experimentation. Not yet `validated`.

## Pain

Span of control unclear

## Output

Analysis typed

## Usage

```ts
import { createHrOrgChartAnalyzerAgent } from './agents/hr-org-chart-analyzer/agent'
const result = await createHrOrgChartAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
