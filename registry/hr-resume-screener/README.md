# Resume Screener

> **Status: alpha** — installable via `npx agentskit add hr-resume-screener` for experimentation. Not yet `validated`.

## Pain

Screening bottleneck

## Output

Screen typed

## Usage

```ts
import { createHrResumeScreenerAgent } from './agents/hr-resume-screener/agent'
const result = await createHrResumeScreenerAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
