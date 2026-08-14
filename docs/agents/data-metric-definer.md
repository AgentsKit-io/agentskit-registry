# Metric Definer

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Creates a typed metric definition from an ambiguous metric request.

## Install and try

```bash
npx agentskit add data-metric-definer
npm test -- --run registry/data-metric-definer/agent.test.ts
```

The test covers a structured metric definition, denominator ambiguity, and empty input rejection.

## Limits and contribution

A definition is not a validated dashboard metric. Review grain, numerator, denominator, time window, exclusions, owner, and source system before adoption.

Activation: contribute an adversarial metric request with an ambiguous denominator and the human-approved definition.

Evidence: `registry/data-metric-definer/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
