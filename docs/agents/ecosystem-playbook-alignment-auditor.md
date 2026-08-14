# Playbook Alignment Auditor

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Returns typed findings comparing a Registry agent with supplied Playbook patterns.

## Install and try

```bash
npx agentskit add ecosystem-playbook-alignment-auditor
npm test -- --run registry/ecosystem-playbook-alignment-auditor/agent.test.ts
```

The test covers a finding response and rejects empty input.

## Limits and contribution

Findings are review input, not an automatic compliance decision. Include the relevant pattern version and verify each finding against source before changing an agent.

Activation: contribute one false-positive fixture and one real-drift fixture, each linked to the verified source pattern.

Evidence: `registry/ecosystem-playbook-alignment-auditor/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
