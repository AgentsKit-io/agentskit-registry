# Expense Policy Auditor

> **Status: alpha** — installable via `npx agentskit add fintech-expense-policy-auditor` for experimentation. Not yet `validated`.

## Pain

Expense abuse

## Output

Violations typed

## Usage

```ts
import { createFintechExpensePolicyAuditorAgent } from './agents/fintech-expense-policy-auditor/agent'
const result = await createFintechExpensePolicyAuditorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
