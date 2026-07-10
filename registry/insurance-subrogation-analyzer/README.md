# Subrogation Analyzer

> **Status: alpha** — installable via `npx agentskit add insurance-subrogation-analyzer` for experimentation. Not yet `validated`.

## Pain

Subrogation complex

## Output

Analysis typed

## Usage

```ts
import { createInsuranceSubrogationAnalyzerAgent } from './agents/insurance-subrogation-analyzer/agent'
const result = await createInsuranceSubrogationAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
