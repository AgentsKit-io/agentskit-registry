# Integration Mapper

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Maps an agent's stated pain to possible `@agentskit/integrations` choices and returns a typed integration map.

## Install and try

```bash
npx agentskit add ecosystem-integration-mapper
npm test -- --run registry/ecosystem-integration-mapper/agent.test.ts
```

The test runs a sample mapping and rejects an empty request.

## Limits and contribution

The map is a recommendation, not proof that an integration is available or production-safe. Review permissions, data boundaries, and package compatibility before adoption.

Activation: contribute a mapping with an explicit permission boundary and the compatibility check used by the reviewer.

Evidence: `registry/ecosystem-integration-mapper/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
