# Third-party Risk

> **Status: alpha** — installable via `npx agentskit add security-third-party-risk` for experimentation. Not yet `validated`.

## Pain

Vendor risk

## Output

Assessment typed

## Usage

```ts
import { createSecurityThirdPartyRiskAgent } from './agents/security-third-party-risk/agent'
const result = await createSecurityThirdPartyRiskAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
