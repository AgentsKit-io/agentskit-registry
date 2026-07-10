# Registry Eval Author

> **Status: alpha** — installable via `npx agentskit add ecosystem-registry-eval-author` for experimentation. Not yet `validated`.

## Pain

Validated agents need eval.ts cases

## Output

Eval cases typed for @agentskit/eval

## Usage

```ts
import { createEcosystemRegistryEvalAuthorAgent } from './agents/ecosystem-registry-eval-author/agent'
const result = await createEcosystemRegistryEvalAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
