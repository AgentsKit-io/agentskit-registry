# Integration Mapper

> **Status: alpha** — installable via `npx agentskit add ecosystem-integration-mapper` for experimentation. Not yet `validated`.

## Pain

Match agent pains to @agentskit/integrations

## Output

Integration map typed per agent

## Usage

```ts
import { createEcosystemIntegrationMapperAgent } from './agents/ecosystem-integration-mapper/agent'
const result = await createEcosystemIntegrationMapperAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
