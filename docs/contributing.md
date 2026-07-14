# Contribute to Registry

Contributions expand the public starting-point catalog without lowering its
trust bar. Begin with the repository [contribution contract](../CONTRIBUTING.md)
and use an existing agent in the same category as a concrete reference.

Each agent must include `agent.ts`, `meta.json`, `agent.test.ts`, and `README.md`.
Metadata must declare the copied files, packages, category, tags/capabilities,
status, and compatibility information. Tests must prove the agent's typed
contract and safety behavior without requiring live credentials.

Before opening a pull request:

```bash
npm run validate
npm run lint
npm test
npm run eval:run -- --ecosystem-doc-bridge
npm run build
npm run docs:bridge:gate
git diff --exit-code public
```

The generated catalog, discovery artifact, claim ledger, and Doc Bridge index
must be committed and fresh. Never edit generated files to make a gate pass;
fix their canonical source or generator.
