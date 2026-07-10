# Release Risk

> **Status: alpha** — installable via `npx agentskit add product-release-risk` for experimentation. Not yet `validated`.

## Pain

Release risk opaque

## Output

Risk typed

## Usage

```ts
import { createProductReleaseRiskAgent } from './agents/product-release-risk/agent'
const result = await createProductReleaseRiskAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
