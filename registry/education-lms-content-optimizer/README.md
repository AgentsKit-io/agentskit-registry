# LMS Content Optimizer

> **Status: alpha** — installable via `npx agentskit add education-lms-content-optimizer` for experimentation. Not yet `validated`.

## Pain

LMS content weak

## Output

Optimizations typed

## Usage

```ts
import { createEducationLmsContentOptimizerAgent } from './agents/education-lms-content-optimizer/agent'
const result = await createEducationLmsContentOptimizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
