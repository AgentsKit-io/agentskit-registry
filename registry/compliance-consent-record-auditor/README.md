# Consent Record Auditor

> **Status: alpha** — installable via `npx agentskit add compliance-consent-record-auditor` for experimentation. Not yet `validated`.

## Pain

Consent gaps

## Output

Audit typed

## Usage

```ts
import { createComplianceConsentRecordAuditorAgent } from './agents/compliance-consent-record-auditor/agent'
const result = await createComplianceConsentRecordAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
