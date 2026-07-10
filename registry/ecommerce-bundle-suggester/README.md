# Bundle Suggester

> **Status: alpha** — installable via `npx agentskit add ecommerce-bundle-suggester` for experimentation. Not yet `validated`.

## Pain

Bundles manual

## Output

Bundles typed

## Usage

```ts
import { createEcommerceBundleSuggesterAgent } from './agents/ecommerce-bundle-suggester/agent'
const result = await createEcommerceBundleSuggesterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
