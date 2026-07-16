# Contributing an agent

Agents here are intentionally small and self-contained. To add one:

1. Create `registry/<id>/` with:
   - `agent.ts` — a `create<Name>Agent(config)` factory that wires **published**
     `@agentskit/*` packages (skill + tools + `createRuntime`). No private/internal imports.
   - `meta.json` — conforms to [`registry.schema.json`](./registry.schema.json).
   - `agent.test.ts` — at minimum, "constructs and runs against `mockAdapter`".
   - `README.md` — concept + `npx agentskit add <id>` + usage + required env.
2. `npm run lint && npm test && npm run build` must pass.
3. Deterministic discovery uses `@agentskit/chat/protocol` via exact `@agentskit/chat@0.4.0` only — never reintroduce `@agentskit/chat-protocol` or a chat UI runtime (`npm run check:no-legacy-chat-imports`).
4. Open a PR.

## Principles (inherited from the AgentsKit Manifesto)

- **Zero lock-in** — the user owns the copied code; depend only on published packages.
- **Provider-agnostic** — take an `adapter` in config; never hard-code one provider.
- **Predictable** — a factory that takes ten minutes to learn beats a clever one.
- **Docs are product** — no README, no merge.

Agents are curated, not gatekept by the framework's full gate suite — keep them
honest, tested, and small.

## Catalog vs validated agents

The full roadmap lives in `catalog/manifest.json` (~300+ agent specs). Only agents
with `"status": "validated"` in `meta.json` appear in `public/r/index.json` and
are installable via `npx agentskit add <id>`.

To scaffold a draft spec into code:

```bash
npm run scaffold -- ecosystem-doc-bridge-memory-classifier
```

Promote a draft: implement the real Zod contract, add `eval.ts`, pass CI, set
`status: validated`, open PR.

See `catalog/CATALOG.md` and `catalog/content-policy.json` — sensitive verticals
(weapons, adult, political campaigning, etc.) are blocked.
