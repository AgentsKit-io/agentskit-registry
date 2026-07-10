# Semantic Layer Mapper

> **Status: alpha** — installable via `npx agentskit add data-semantic-layer-mapper` for experimentation. Not yet `validated`.

## Pain

Semantic layer drift

## Output

Map typed

## Usage

```ts
import { createDataSemanticLayerMapperAgent } from './agents/data-semantic-layer-mapper/agent'
const result = await createDataSemanticLayerMapperAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
