# Email Triage

> **Status: alpha** — installable via `npx agentskit add productivity-email-triage` for experimentation. Not yet `validated`.

## Pain

Inbox overload

## Output

Classification typed

## Usage

```ts
import { createProductivityEmailTriageAgent } from './agents/productivity-email-triage/agent'
const result = await createProductivityEmailTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
