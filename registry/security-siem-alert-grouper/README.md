# SIEM Alert Grouper

> **Status: alpha** — installable via `npx agentskit add security-siem-alert-grouper` for experimentation. Not yet `validated`.

## Pain

Alert noise

## Output

Groups typed

## Usage

```ts
import { createSecuritySiemAlertGrouperAgent } from './agents/security-siem-alert-grouper/agent'
const result = await createSecuritySiemAlertGrouperAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
