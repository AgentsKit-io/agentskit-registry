# Registry catalog

## Purpose

Agent lifecycle metadata, catalog policy, and the generator for public
Registry catalog artifacts.

## Source of truth

- Catalog source: [`../../catalog/`](../../catalog/)
- Generator: [`../../scripts/build-registry.mjs`](../../scripts/build-registry.mjs)
- Generated output: [`../../public/r/catalog.json`](../../public/r/catalog.json)

## Change route

Edit catalog source or its generator, then regenerate public artifacts. Do not
hand-edit generated catalog JSON.

## Checks

Run `npm run validate`, `npm test`, `npm run build`, and
`npm run docs:bridge:gate`.
