# NPS Analyzer

> **Status: alpha** — installable via `npx agentskit add product-nps-analyzer` for experimentation. Not yet `validated`.

## Pain

NPS insights slow

## Output

Insights typed

## Usage

```ts
import { createProductNpsAnalyzerAgent } from './agents/product-nps-analyzer/agent'
const result = await createProductNpsAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
