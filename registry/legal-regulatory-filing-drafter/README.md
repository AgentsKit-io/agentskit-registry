# Regulatory Filing Drafter

> **Status: alpha** — installable via `npx agentskit add legal-regulatory-filing-drafter` for experimentation. Not yet `validated`.

## Pain

Filings slow

## Output

Filing typed

## Usage

```ts
import { createLegalRegulatoryFilingDrafterAgent } from './agents/legal-regulatory-filing-drafter/agent'
const result = await createLegalRegulatoryFilingDrafterAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
