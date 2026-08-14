# Ecosystem Changelog

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Builds a typed changelog across the AgentsKit, Registry, Playbook, and AKOS surfaces from supplied change context.

## Install and try

```bash
npx agentskit add ecosystem-changelog-ecosystem
npm test -- --run registry/ecosystem-changelog-ecosystem/agent.test.ts
```

The test covers a structured changelog response and rejects empty input.

## Limits and contribution

It does not discover or publish releases by itself. Verify dates, links, audience, and source repositories before editorial use.

Activation: contribute a cross-repository change fixture with canonical links, audience, and the verified release date.

Evidence: `registry/ecosystem-changelog-ecosystem/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
