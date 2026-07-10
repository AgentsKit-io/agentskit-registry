# Change Advisory

> **Status: alpha** — installable via `npx agentskit add devops-change-advisory` for experimentation. Not yet `validated`.

## Pain

CAB reviews slow

## Output

Advisory typed

## Usage

```ts
import { createDevopsChangeAdvisoryAgent } from './agents/devops-change-advisory/agent'
const result = await createDevopsChangeAdvisoryAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
