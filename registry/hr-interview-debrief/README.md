# Interview Debrief

> **Status: alpha** — installable via `npx agentskit add hr-interview-debrief` for experimentation. Not yet `validated`.

## Pain

Debriefs unstructured

## Output

Debrief typed

## Usage

```ts
import { createHrInterviewDebriefAgent } from './agents/hr-interview-debrief/agent'
const result = await createHrInterviewDebriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
