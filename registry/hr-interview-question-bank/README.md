# Interview Question Bank

> **Status: alpha** — installable via `npx agentskit add hr-interview-question-bank` for experimentation. Not yet `validated`.

## Pain

Inconsistent interviews

## Output

Questions typed

## Usage

```ts
import { createHrInterviewQuestionBankAgent } from './agents/hr-interview-question-bank/agent'
const result = await createHrInterviewQuestionBankAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
