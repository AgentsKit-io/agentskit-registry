# Student Progress Summary

> **Status: alpha** — installable via `npx agentskit add education-student-progress-summary` for experimentation. Not yet `validated`.

## Pain

Progress reports

## Output

Summary typed

## Usage

```ts
import { createEducationStudentProgressSummaryAgent } from './agents/education-student-progress-summary/agent'
const result = await createEducationStudentProgressSummaryAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
