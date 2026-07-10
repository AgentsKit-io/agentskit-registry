# Runbook Author

> **Status: alpha** — installable via `npx agentskit add ops-runbook-author` for experimentation. Not yet `validated`.

## Pain

Missing runbooks

## Output

Runbook typed

## Usage

```ts
import { createOpsRunbookAuthorAgent } from './agents/ops-runbook-author/agent'
const result = await createOpsRunbookAuthorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
