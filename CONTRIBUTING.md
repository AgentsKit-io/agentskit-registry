# Contributing an agent

Agents here are intentionally small and self-contained. To add one:

1. Create `registry/<id>/` with:
   - `agent.ts` — a `create<Name>Agent(config)` factory that wires **published**
     `@agentskit/*` packages (skill + tools + `createRuntime`). No private/internal imports.
   - `meta.json` — conforms to [`registry.schema.json`](./registry.schema.json).
   - `agent.test.ts` — at minimum, "constructs and runs against `mockAdapter`".
   - `README.md` — concept + `npx agentskit add <id>` + usage + required env.
2. `npm run lint && npm test && npm run build` must pass.
3. Open a PR.

## Principles (inherited from the AgentsKit Manifesto)

- **Zero lock-in** — the user owns the copied code; depend only on published packages.
- **Provider-agnostic** — take an `adapter` in config; never hard-code one provider.
- **Predictable** — a factory that takes ten minutes to learn beats a clever one.
- **Docs are product** — no README, no merge.

Agents are curated, not gatekept by the framework's full gate suite — keep them
honest, tested, and small.
