# CMA Author

> **Status: alpha** — installable via `npx agentskit add realestate-cma-author` for experimentation. Not yet `validated`.

## Pain

CMAs slow

## Output

CMA typed

## Usage

```ts
import { createRealestateCmaAuthorAgent } from './agents/realestate-cma-author/agent'
const result = await createRealestateCmaAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
