# Competitive Feature Gap

> **Status: alpha** — installable via `npx agentskit add product-competitive-feature-gap` for experimentation. Not yet `validated`.

## Pain

Feature gaps unclear

## Output

Gap analysis typed

## Usage

```ts
import { createProductCompetitiveFeatureGapAgent } from './agents/product-competitive-feature-gap/agent'
const result = await createProductCompetitiveFeatureGapAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
