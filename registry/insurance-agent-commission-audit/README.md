# Agent Commission Audit

> **Status: alpha** — installable via `npx agentskit add insurance-agent-commission-audit` for experimentation. Not yet `validated`.

## Pain

Commission errors

## Output

Audit typed

## Usage

```ts
import { createInsuranceAgentCommissionAuditAgent } from './agents/insurance-agent-commission-audit/agent'
const result = await createInsuranceAgentCommissionAuditAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
