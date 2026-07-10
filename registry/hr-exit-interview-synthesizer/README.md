# Exit Interview Synthesizer

> **Status: alpha** — installable via `npx agentskit add hr-exit-interview-synthesizer` for experimentation. Not yet `validated`.

## Pain

Exit insights lost

## Output

Insights typed

## Usage

```ts
import { createHrExitInterviewSynthesizerAgent } from './agents/hr-exit-interview-synthesizer/agent'
const result = await createHrExitInterviewSynthesizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
