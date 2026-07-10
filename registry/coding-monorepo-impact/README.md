# Monorepo Impact Analyzer

> **Status: alpha** — installable via `npx agentskit add coding-monorepo-impact` for experimentation. Not yet `validated`.

## Pain

Blast radius unknown

## Output

Affected packages typed

## Usage

```ts
import { createCodingMonorepoImpactAgent } from './agents/coding-monorepo-impact/agent'
const result = await createCodingMonorepoImpactAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
