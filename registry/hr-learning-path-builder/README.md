# Learning Path Builder

> **Status: alpha** — installable via `npx agentskit add hr-learning-path-builder` for experimentation. Not yet `validated`.

## Pain

Learning paths manual

## Output

Path typed

## Usage

```ts
import { createHrLearningPathBuilderAgent } from './agents/hr-learning-path-builder/agent'
const result = await createHrLearningPathBuilderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
