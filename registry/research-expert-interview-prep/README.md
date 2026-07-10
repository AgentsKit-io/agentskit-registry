# Expert Interview Prep

> **Status: alpha** — installable via `npx agentskit add research-expert-interview-prep` for experimentation. Not yet `validated`.

## Pain

Unprepared interviews

## Output

Question bank typed

## Usage

```ts
import { createResearchExpertInterviewPrepAgent } from './agents/research-expert-interview-prep/agent'
const result = await createResearchExpertInterviewPrepAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
