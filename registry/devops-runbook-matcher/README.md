# Runbook Matcher

> **Status: alpha** — installable via `npx agentskit add devops-runbook-matcher` for experimentation. Not yet `validated`.

## Pain

Alert→runbook gap

## Output

Match typed

## Usage

```ts
import { createDevopsRunbookMatcherAgent } from './agents/devops-runbook-matcher/agent'
const result = await createDevopsRunbookMatcherAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
