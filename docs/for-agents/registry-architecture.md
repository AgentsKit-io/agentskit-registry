# Registry architecture

## Purpose

Registry ownership, contribution routes, generated-artifact ownership, and
the boundary between this source repository and the published application.

## Source of truth

- Architecture: [`../../docs/architecture.md`](../../docs/architecture.md)
- Handoff index: [`index.md`](index.md)
- Contract: [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)

## Change route

Update architecture and contribution contracts here. Keep application
presentation in the AgentsKit repository and generated catalog data out of
hand-edited changes.

## Checks

Run `npm run validate`, `npm test`, `npm run build`, and
`npm run docs:bridge:gate`.
