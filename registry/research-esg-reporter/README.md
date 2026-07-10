# ESG Reporter

> **Status: alpha** — installable via `npx agentskit add research-esg-reporter` for experimentation. Not yet `validated`.

## Pain

ESG disclosure manual

## Output

Report draft typed

## Usage

```ts
import { createResearchEsgReporterAgent } from './agents/research-esg-reporter/agent'
const result = await createResearchEsgReporterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
