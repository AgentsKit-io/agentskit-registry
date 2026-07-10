# Jurisdiction Analyzer

> **Status: alpha** — installable via `npx agentskit add legal-jurisdiction-analyzer` for experimentation. Not yet `validated`.

## Pain

Jurisdiction risk unclear

## Output

Analysis typed

## Usage

```ts
import { createLegalJurisdictionAnalyzerAgent } from './agents/legal-jurisdiction-analyzer/agent'
const result = await createLegalJurisdictionAnalyzerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
