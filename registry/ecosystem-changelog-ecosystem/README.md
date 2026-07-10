# Ecosystem Changelog

> **Status: alpha** — installable via `npx agentskit add ecosystem-changelog-ecosystem` for experimentation. Not yet `validated`.

## Pain

Cross-repo ecosystem changes need unified changelog

## Output

Changelog typed across www/registry/playbook/akos

## Usage

```ts
import { createEcosystemChangelogEcosystemAgent } from './agents/ecosystem-changelog-ecosystem/agent'
const result = await createEcosystemChangelogEcosystemAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
