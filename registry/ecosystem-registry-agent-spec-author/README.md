# Registry Agent Spec Author

> **Status: alpha** — installable via `npx agentskit add ecosystem-registry-agent-spec-author` for experimentation. Not yet `validated`.

## Pain

New agents need consistent specs before scaffold

## Output

Spec typed: pain, output, gates, zod shape outline

## Usage

```ts
import { createEcosystemRegistryAgentSpecAuthorAgent } from './agents/ecosystem-registry-agent-spec-author/agent'
const result = await createEcosystemRegistryAgentSpecAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
