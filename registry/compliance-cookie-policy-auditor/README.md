# Cookie Policy Auditor

> **Status: alpha** — installable via `npx agentskit add compliance-cookie-policy-auditor` for experimentation. Not yet `validated`.

## Pain

Cookie compliance

## Output

Audit typed

## Usage

```ts
import { createComplianceCookiePolicyAuditorAgent } from './agents/compliance-cookie-policy-auditor/agent'
const result = await createComplianceCookiePolicyAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
