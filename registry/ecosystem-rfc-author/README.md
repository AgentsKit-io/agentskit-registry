# RFC Author

> **Status: alpha** — installable via `npx agentskit add ecosystem-rfc-author` for experimentation. Not yet `validated`.

## Pain

Big moves need RFCs before implementation

## Output

RFC draft typed: problem, options, decision

## Usage

```ts
import { createEcosystemRfcAuthorAgent } from './agents/ecosystem-rfc-author/agent'
const result = await createEcosystemRfcAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
