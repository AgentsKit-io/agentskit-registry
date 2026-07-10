# Experiment Designer

> **Status: alpha** — installable via `npx agentskit add product-experiment-designer` for experimentation. Not yet `validated`.

## Pain

Experiments poorly designed

## Output

Design typed

## Usage

```ts
import { createProductExperimentDesignerAgent } from './agents/product-experiment-designer/agent'
const result = await createProductExperimentDesignerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
