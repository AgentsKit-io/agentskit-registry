# AgentsKit Registry handoff

Registry is the canonical source and validation repository for 346 copy-owned
AgentsKit agents. Start with the ownership guide before changing generated data
or agent behavior.

- [Architecture and ownership](../architecture.md)
- [Human quickstart](../getting-started.md)
- [Contribution journey](../contributing.md)
- [Root contribution contract](../../CONTRIBUTING.md)

## Change routes

- Agent behavior or metadata: edit `registry/<id>/`, then run validate, focused
  tests, eval replay, build, and Doc Bridge gates.
- Catalog lifecycle: edit `catalog/` or its generator; never hand-edit
  `public/r/catalog.json`.
- Install bundle or machine discovery: edit `scripts/build-registry.mjs` or
  `scripts/lib/deterministic-discovery.mjs`; generated `public/` files follow.
- Fumadocs layout, SEO, search, or chat presentation: change `apps/registry` in
  `AgentsKit-io/agentskit`, not this repository.
- Exact lookup or answer protocol behavior: change AgentsKit Chat first and
  consume a published release here.

## Required checks

```bash
npm run validate
npm run lint
npm test
npm run eval:run -- --ecosystem-doc-bridge
npm run build
npm run docs:bridge:index
npm run docs:bridge:gate
```
