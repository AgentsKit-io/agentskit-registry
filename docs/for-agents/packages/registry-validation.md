---
docbridge:
  covers:
    - module:scripts/lib/external-agent-validation.mjs
    - module:scripts/lib/readme-standard.mjs
---

# Registry validation

## Purpose

Independent-review evidence and validation summaries for Registry agent
quality, safety, and release readiness. It also audits README standard
freshness: source hashes and review dates.

## Source of truth

- Validation evidence: [`validation/`](../../../validation/)
- Validation helpers: [`scripts/lib/external-agent-validation.mjs`](../../../scripts/lib/external-agent-validation.mjs)
- Contribution contract: [`CONTRIBUTING.md`](../../../CONTRIBUTING.md)
- README standard checks: [`scripts/lib/readme-standard.mjs`](../../../scripts/lib/readme-standard.mjs)

## Exported symbols

- `validateExternalAgents` checks each agent's required files and evidence.
- `resolveValidationRoot` resolves the workspace path that validation reads.
- `computeSourceHash` hashes the sources listed in the README standard.
- `auditReadme` audits a README against its README standard surface.

## Change route

Update validation evidence through executable flows and keep claims traceable
to the source agent, test, and generated artifact.

## Checks

Run `npm run validate`, `npm test`, `npm run build`, and
`npm run docs:bridge:gate`.
