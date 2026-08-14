# Industry Benchmark

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Produces typed benchmark metrics with a source trail for research workflows.

## Install and try

```bash
npx agentskit add research-industry-benchmark
npm test -- --run registry/research-industry-benchmark/agent.test.ts
```

The test covers a structured benchmark response and rejects empty input.

## Limits and contribution

Metrics must be checked against the cited source, date, scope, and methodology. The agent does not make an unsupported benchmark authoritative.

Activation: contribute a benchmark fixture with two sources that differ in scope or methodology, plus the review resolution.

Evidence: `registry/research-industry-benchmark/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
