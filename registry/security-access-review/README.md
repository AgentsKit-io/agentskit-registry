# Access Review

> **Status: alpha** — installable via `npx agentskit add security-access-review` for experimentation. Not yet `validated`.

## Pain

Access reviews slow

## Output

Review typed

## Usage

```ts
import { createSecurityAccessReviewAgent } from './agents/security-access-review/agent'
const result = await createSecurityAccessReviewAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
