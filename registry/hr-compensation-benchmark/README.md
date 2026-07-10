# Compensation Benchmark

> **Status: alpha** — installable via `npx agentskit add hr-compensation-benchmark` for experimentation. Not yet `validated`.

## Pain

Comp research slow

## Output

Benchmark typed

## Usage

```ts
import { createHrCompensationBenchmarkAgent } from './agents/hr-compensation-benchmark/agent'
const result = await createHrCompensationBenchmarkAgent({ adapter }).run(input)
```

## Gates

- cite-sources

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
