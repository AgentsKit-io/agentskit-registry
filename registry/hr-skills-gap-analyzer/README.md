# Skills Gap Analyzer

> **Status: alpha** — installable via `npx agentskit add hr-skills-gap-analyzer` for experimentation. Not yet `validated`.

## Pain

L&D misaligned

## Output

Gaps typed

## Usage

```ts
import { createHrSkillsGapAnalyzerAgent } from './agents/hr-skills-gap-analyzer/agent'
const result = await createHrSkillsGapAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
