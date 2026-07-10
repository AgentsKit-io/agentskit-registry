# Lesson Plan Author

> **Status: alpha** — installable via `npx agentskit add education-lesson-plan-author` for experimentation. Not yet `validated`.

## Pain

Lesson planning slow

## Output

Plan typed

## Usage

```ts
import { createEducationLessonPlanAuthorAgent } from './agents/education-lesson-plan-author/agent'
const result = await createEducationLessonPlanAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
