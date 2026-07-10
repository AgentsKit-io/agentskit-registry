# Data Quality Rule Author

> **Status: alpha** — installable via `npx agentskit add data-quality-rule-author` for experimentation. Not yet `validated`.

## Pain

DQ rules manual

## Output

Rules typed

## Usage

```ts
import { createDataQualityRuleAuthorAgent } from './agents/data-quality-rule-author/agent'
const result = await createDataQualityRuleAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
