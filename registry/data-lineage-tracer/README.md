# Lineage Tracer

> **Status: alpha** — installable via `npx agentskit add data-lineage-tracer` for experimentation. Not yet `validated`.

## Pain

Lineage unknown

## Output

Lineage typed

## Usage

```ts
import { createDataLineageTracerAgent } from './agents/data-lineage-tracer/agent'
const result = await createDataLineageTracerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
