# Phishing Triage

> **Status: alpha** — installable via `npx agentskit add security-phishing-triage` for experimentation. Not yet `validated`.

## Pain

Phishing reports

## Output

Triage typed

## Usage

```ts
import { createSecurityPhishingTriageAgent } from './agents/security-phishing-triage/agent'
const result = await createSecurityPhishingTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
