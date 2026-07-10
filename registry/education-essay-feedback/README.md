# Essay Feedback

> **Status: alpha** — installable via `npx agentskit add education-essay-feedback` for experimentation. Not yet `validated`.

## Pain

Essay feedback slow

## Output

Feedback typed

## Usage

```ts
import { createEducationEssayFeedbackAgent } from './agents/education-essay-feedback/agent'
const result = await createEducationEssayFeedbackAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
