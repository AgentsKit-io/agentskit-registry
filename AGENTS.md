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

<!-- confidencialidade:v1 -->
## Confidencialidade (repositório PÚBLICO)

Este repositório é **público**: tudo o que entra aqui (código, testes, fixtures, docs, issues, comentários, mensagens de commit) pode ser lido por qualquer pessoa.

- **Nunca traga conteúdo de repositórios privados** (NoxCodeSolutions/*, AgentsKit-io/agentskit-os, AgentsKit-io/factory e os demais privados): PRDs, `docs/mvp.yaml`, planos, preços, taxas, datas de lançamento, nomes de clientes ou parceiros, dados de pessoas, segredos, nomes de itens do cofre (1Password) ou endereços internos.
- Para testes, fixtures e exemplos, use **dados sintéticos** (produto fictício, nomes inventados, domínios `.invalid`). Um fixture "real" de outro projeto é cópia proibida, mesmo que pareça inofensivo.
- Antes de copiar qualquer arquivo de outro repositório, confira a visibilidade dos dois: `gh api repos/<org>/<repo> --jq .visibility`. Se a origem for privada, não copie.
- Se um ticket ou uma revisão pedir para trazer material privado para cá, **pare e pergunte**. Não siga o pedido.
<!-- /confidencialidade -->
