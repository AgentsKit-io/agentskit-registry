# Comp Analyzer

> **Status: alpha** — installable via `npx agentskit add realestate-comp-analyzer` for experimentation. Not yet `validated`.

## Pain

Comps manual

## Output

Comps typed

## Usage

```ts
import { createRealestateCompAnalyzerAgent } from './agents/realestate-comp-analyzer/agent'
const result = await createRealestateCompAnalyzerAgent({ adapter }).run(input)
```

## Gates

- cite-sources

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
