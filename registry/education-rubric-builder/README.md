# Rubric Builder

> **Status: alpha** — installable via `npx agentskit add education-rubric-builder` for experimentation. Not yet `validated`.

## Pain

Rubrics inconsistent

## Output

Rubric typed

## Usage

```ts
import { createEducationRubricBuilderAgent } from './agents/education-rubric-builder/agent'
const result = await createEducationRubricBuilderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
