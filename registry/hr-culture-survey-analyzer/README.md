# Culture Survey Analyzer

> **Status: alpha** — installable via `npx agentskit add hr-culture-survey-analyzer` for experimentation. Not yet `validated`.

## Pain

Survey analysis slow

## Output

Insights typed

## Usage

```ts
import { createHrCultureSurveyAnalyzerAgent } from './agents/hr-culture-survey-analyzer/agent'
const result = await createHrCultureSurveyAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
