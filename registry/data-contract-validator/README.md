# Data Contract Validator

> **Status: alpha** — installable via `npx agentskit add data-contract-validator` for experimentation. Not yet `validated`.

## Pain

Contract violations

## Output

Violations typed

## Usage

```ts
import { createDataContractValidatorAgent } from './agents/data-contract-validator/agent'
const result = await createDataContractValidatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
