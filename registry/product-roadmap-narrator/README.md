# Roadmap Narrator

> **Status: alpha** — installable via `npx agentskit add product-roadmap-narrator` for experimentation. Not yet `validated`.

## Pain

Roadmap communication

## Output

Narrative typed

## Usage

```ts
import { createProductRoadmapNarratorAgent } from './agents/product-roadmap-narrator/agent'
const result = await createProductRoadmapNarratorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
