# Doc-bridge Handoff Author

> **Status: alpha** — installable via `npx agentskit add ecosystem-doc-bridge-handoff-author` for experimentation. Not yet `validated`.

## Pain

Agent handoffs between doc-bridge index and human adapters

## Output

Handoff doc typed per agent-handoff-v1 schema

## Usage

```ts
import { createEcosystemDocBridgeHandoffAuthorAgent } from './agents/ecosystem-doc-bridge-handoff-author/agent'
const result = await createEcosystemDocBridgeHandoffAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
