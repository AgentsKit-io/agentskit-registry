# NIST Compliance Gap

> **Status: alpha** — installable via `npx agentskit add security-compliance-gap-nist` for experimentation. Not yet `validated`.

## Pain

NIST gaps

## Output

Gaps typed

## Usage

```ts
import { createSecurityComplianceGapNistAgent } from './agents/security-compliance-gap-nist/agent'
const result = await createSecurityComplianceGapNistAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
