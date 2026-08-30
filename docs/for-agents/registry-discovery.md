# Registry discovery

## Purpose

Deterministic machine-readable discovery artifacts used by AgentsKit Chat and
other consumers to locate Registry knowledge.

## Source of truth

- Implementation: [`../../scripts/lib/deterministic-discovery.mjs`](../../scripts/lib/deterministic-discovery.mjs)
- Build entrypoint: [`../../scripts/build-discovery.mjs`](../../scripts/build-discovery.mjs)
- Generated artifacts: [`../../public/deterministic/`](../../public/deterministic/)

## Change route

Change the deterministic source, regenerate the public artifact, and validate
the output before publishing it.

## Checks

Run `npm run discovery:build`, `npm test`, `npm run build`, and
`npm run docs:bridge:gate`.
