# Security Policy Drafter

> **Status: alpha** — installable via `npx agentskit add security-policy-drafter` for experimentation. Not yet `validated`.

## Pain

Policies manual

## Output

Policy typed

## Usage

```ts
import { createSecurityPolicyDrafterAgent } from './agents/security-policy-drafter/agent'
const result = await createSecurityPolicyDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
