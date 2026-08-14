# Fact Checker

Status: human guide. Owner: Emerson Braun. Reviewed: 2026-08-14.

## What it does

Turns claims into typed fact-checking output for editorial review.

## Install and try

```bash
npx agentskit add content-fact-checker
npm test -- --run registry/content-fact-checker/agent.test.ts
```

The test covers a structured claims response and rejects empty input.

## Limits and contribution

Claims require source inspection and a human editorial decision. Do not treat a generated verdict as publication approval or as a substitute for primary-source checking.

Activation: contribute a fixture with an ambiguous claim, conflicting sources, and the human decision that resolved it.

Evidence: `registry/content-fact-checker/README.md`, `meta.json`, `agent.test.ts`, `eval.ts`.
