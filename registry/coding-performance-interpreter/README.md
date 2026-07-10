# Performance Interpreter

> **Status: alpha** — installable via `npx agentskit add coding-performance-interpreter` for experimentation. Not yet `validated`.

## Pain

Lighthouse/bundle reports opaque

## Output

Bottlenecks typed

## Usage

```ts
import { createCodingPerformanceInterpreterAgent } from './agents/coding-performance-interpreter/agent'
const result = await createCodingPerformanceInterpreterAgent({ adapter }).run(input)
```

## Gates

- cite-metrics

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
