# Handbook Updater

> **Status: alpha** — installable via `npx agentskit add hr-employee-handbook-updater` for experimentation. Not yet `validated`.

## Pain

Handbook drift

## Output

Updates typed

## Usage

```ts
import { createHrEmployeeHandbookUpdaterAgent } from './agents/hr-employee-handbook-updater/agent'
const result = await createHrEmployeeHandbookUpdaterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
