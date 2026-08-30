# Registry validation

## Purpose

Independent-review evidence and validation summaries for Registry agent
quality, safety, and release readiness.

## Source of truth

- Validation evidence: [`../../validation/`](../../validation/)
- Validation helpers: [`../../scripts/lib/external-agent-validation.mjs`](../../scripts/lib/external-agent-validation.mjs)
- Contribution contract: [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)

## Change route

Update validation evidence through executable flows and keep claims traceable
to the source agent, test, and generated artifact.

## Checks

Run `npm run validate`, `npm test`, `npm run build`, and
`npm run docs:bridge:gate`.
