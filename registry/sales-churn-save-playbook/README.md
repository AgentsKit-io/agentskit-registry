# Churn Save Playbook

> **Status: alpha** — installable via `npx agentskit add sales-churn-save-playbook` for experimentation. Not yet `validated`.

## Pain

Save plays inconsistent

## Output

Playbook typed

## Usage

```ts
import { createSalesChurnSavePlaybookAgent } from './agents/sales-churn-save-playbook/agent'
const result = await createSalesChurnSavePlaybookAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
