# Rollback Advisor

> **Status: alpha** — installable via `npx agentskit add devops-rollback-advisor` for experimentation. Not yet `validated`.

## Pain

Rollback decisions

## Output

Recommendation typed

## Usage

```ts
import { createDevopsRollbackAdvisorAgent } from './agents/devops-rollback-advisor/agent'
const result = await createDevopsRollbackAdvisorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
