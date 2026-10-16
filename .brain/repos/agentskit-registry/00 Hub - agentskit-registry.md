---
tipo: repo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits:
  agentskit-registry: 87c2ddc
metodo: análise estática; doc-bridge.config.json lido; instalação/indexação não concluídas por falha de rede/cache
fontes: ["README.md", "AGENTS.md", "docs/architecture.md", "docs/for-agents/index.md", "package.json", "scripts/build-registry.mjs", "scripts/lib/deterministic-discovery.mjs", ".github/workflows/ci.yml"]
tags: [repo, repo/agentskit-registry, camada/ferramenta]
---

# agentskit-registry

> [!tldr] Em linguagem comum
> Mantém fontes de agentes AgentsKit, evidências públicas e os arquivos reproduzíveis que permitem encontrá-los e copiá-los para um projeto.

← [[00 Hub - Ecossistema AgentsKit]]

## Responsabilidade e limites

O repositório é fonte canônica do catálogo, validadores e bundles; não fornece runtime, CLI de instalação nem a aplicação visual. Agentes copiados são código do consumidor e compõem releases publicados `@agentskit/*` (AGENTS.md:1; docs/architecture.md:3).

## Módulos

| Nota | Responsabilidade |
|---|---|
| [[registry-catalogo]] | Dados catalogados e geração de bundles/indexes públicos |
| [[registry-validacao]] | Validação de fontes, política e evidência pública |
| [[registry-descoberta]] | Conhecimento determinístico e configuração do site |

## Fluxos e guias

- [[Registry - Da contribuição ao bundle]]
- [[Registry - Descoberta sem IA]]
- [[Contribuir e validar um agente]]
- [[Regenerar catálogo e descoberta]]

## Relações do ecossistema

| Relação | Evidência |
|---|---|
| [[00 Hub - agentskit]] fornece runtime e CLI que consumidores usam | README.md:80; docs/architecture.md:23 |
| [[00 Hub - agentskit-chat]] fornece protocolo determinístico importado pelo build | docs/architecture.md:17; package.json:43 |
| A aplicação Registry vive no monorepo AgentsKit | docs/architecture.md:3 |
| [[00 Hub - doc-bridge]] é dependência de desenvolvimento e gate documental | package.json:46; AGENTS.md:13 |

## Artefatos e operação

`public/r`, `public/deterministic`, `ecosystem-claims.json` e `.doc-bridge` são gerados; editar fonte e reconstruir é obrigatório (AGENTS.md:9). O workflow CI usa Node 22 e executa validação, lint, testes, replay, build e gates Doc Bridge (`.github/workflows/ci.yml:20). Build local principal: `npm run build` (package.json:14).

## Detalhe técnico

- `scripts/build-registry.mjs` incorpora fontes e escreve índice e bundles; rascunhos têm `installable: false` (scripts/build-registry.mjs:6; scripts/build-registry.mjs:142).
- `scripts/lib/deterministic-discovery.mjs` delega esquema, normalização e hash a `@agentskit/chat/protocol` (scripts/lib/deterministic-discovery.mjs:12).
- O projeto não tem ADRs no repositório em `docs/adr/`; sua história relevante está no Git e nos contratos atuais.

> [!question] Dúvida
> A configuração Doc Bridge existe, mas `.doc-bridge/index.json` não está presente e a instalação falhou por ausência de pacote em cache e rede indisponível; relações verificadas pelo índice permanecem por confirmar.
