# Doc-bridge Memory Classifier

> **Status: alpha** — installable via `npx agentskit add ecosystem-doc-bridge-memory-classifier` for experimentation. Not yet `validated`.

## Pain

Private notes → memory candidates for doc-bridge

## Output

Candidates typed: promote/hold/reject + rationale

## Usage

```ts
import { createEcosystemDocBridgeMemoryClassifierAgent } from './agents/ecosystem-doc-bridge-memory-classifier/agent'
const result = await createEcosystemDocBridgeMemoryClassifierAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
