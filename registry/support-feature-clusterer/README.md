# Feature Request Clusterer

> **Status: alpha** — installable via `npx agentskit add support-feature-clusterer` for experimentation. Not yet `validated`.

## Pain

FRs scattered

## Output

Clusters typed

## Usage

```ts
import { createSupportFeatureClustererAgent } from './agents/support-feature-clusterer/agent'
const result = await createSupportFeatureClustererAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
