# Curriculum Mapper

> **Status: alpha** — installable via `npx agentskit add education-curriculum-mapper` for experimentation. Not yet `validated`.

## Pain

Curriculum alignment

## Output

Map typed

## Usage

```ts
import { createEducationCurriculumMapperAgent } from './agents/education-curriculum-mapper/agent'
const result = await createEducationCurriculumMapperAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
