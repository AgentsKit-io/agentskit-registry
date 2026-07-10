# GDPR DPIA Drafter

> **Status: alpha** — installable via `npx agentskit add compliance-gdpr-dpia-drafter` for experimentation. Not yet `validated`.

## Pain

DPIA manual

## Output

DPIA typed

## Usage

```ts
import { createComplianceGdprDpiaDrafterAgent } from './agents/compliance-gdpr-dpia-drafter/agent'
const result = await createComplianceGdprDpiaDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
