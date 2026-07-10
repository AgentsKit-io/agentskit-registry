# Industry Benchmark

> **Status: alpha** — installable via `npx agentskit add research-industry-benchmark` for experimentation. Not yet `validated`.

## Pain

Benchmark hunting

## Output

Metrics typed + source

## Usage

```ts
import { createResearchIndustryBenchmarkAgent } from './agents/research-industry-benchmark/agent'
const result = await createResearchIndustryBenchmarkAgent({ adapter }).run(input)
```

## Gates

- no-invented-stats

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
