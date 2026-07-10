# Quiz Generator

> **Status: alpha** — installable via `npx agentskit add education-quiz-generator` for experimentation. Not yet `validated`.

## Pain

Quiz creation

## Output

Quiz typed

## Usage

```ts
import { createEducationQuizGeneratorAgent } from './agents/education-quiz-generator/agent'
const result = await createEducationQuizGeneratorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
