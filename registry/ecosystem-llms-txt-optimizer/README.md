# llms.txt Optimizer

> **Status: alpha** — installable via `npx agentskit add ecosystem-llms-txt-optimizer` for experimentation. Not yet `validated`.

## Pain

Machine discovery files need curation

## Output

Optimized llms.txt block typed

## Usage

```ts
import { createEcosystemLlmsTxtOptimizerAgent } from './agents/ecosystem-llms-txt-optimizer/agent'
const result = await createEcosystemLlmsTxtOptimizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
