# AGENTS.md

AgentsKit Registry owns source, metadata, validation evidence, install bundles,
and deterministic discovery for ready-to-use AgentsKit agents. Read
[`docs/for-agents/index.md`](./docs/for-agents/index.md) before editing.

## Non-negotiable boundaries

1. Never recreate AgentsKit runtime, adapter, tool, skill, memory, RAG, eval, or
   CLI behavior. Registry agents compose supported `@agentskit/*` releases.
2. Never recreate AgentsKit Chat protocols or fuzzy-match locally. Generate its
   published deterministic artifact and escalate semantic questions.
3. Files under `public/r`, `public/deterministic`, `ecosystem-claims.json`, and
   `.doc-bridge` are generated. Change their canonical source and rebuild.
4. Draft agents are not installable. Validated claims require public evidence.
5. Keep boundaries typed; no credentials, prompts, private reviewer output, or
   user queries may enter generated claims, artifacts, logs, or analytics.

## doc-bridge

Route coding agents with `@agentskit/doc-bridge` (`ak-docs`).

```bash
npm run docs:bridge:index   # or pnpm
npx ak-docs query package <registry agent id> --agent
npx ak-docs gate run
```

MCP: `ak-docs mcp` → tools `handoff.resolve`, `doc.search`, `doc.get`.

Before shipping, run validate, lint, tests, eval replay, build, Doc Bridge, and
confirm every committed generated artifact has no diff.
