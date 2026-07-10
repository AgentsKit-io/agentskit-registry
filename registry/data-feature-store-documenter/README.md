# Feature Store Documenter

> **Status: alpha** — installable via `npx agentskit add data-feature-store-documenter` for experimentation. Not yet `validated`.

## Pain

Features undocumented

## Output

Docs typed

## Usage

```ts
import { createDataFeatureStoreDocumenterAgent } from './agents/data-feature-store-documenter/agent'
const result = await createDataFeatureStoreDocumenterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
