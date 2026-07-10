# Threat Intel Brief

> **Status: alpha** — installable via `npx agentskit add security-threat-intel-brief` for experimentation. Not yet `validated`.

## Pain

Threat intel scattered

## Output

Brief typed

## Usage

```ts
import { createSecurityThreatIntelBriefAgent } from './agents/security-threat-intel-brief/agent'
const result = await createSecurityThreatIntelBriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
