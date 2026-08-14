# Market Sizing

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Creates a typed TAM/SAM/SOM sizing analysis with explicit assumptions.

## Install and try

```bash
npx agentskit add research-market-sizing
npm test -- --run registry/research-market-sizing/agent.test.ts
```

The test covers a structured sizing response and rejects empty input.

## Limits and contribution

Sizing is assumption-sensitive and is not a forecast by itself. Review definitions, denominator, geography, period, data sources, and sensitivity before using the result.

Activation: contribute a sensitivity fixture that changes the denominator or geography and records the accepted assumption set.

Evidence: `registry/research-market-sizing/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
