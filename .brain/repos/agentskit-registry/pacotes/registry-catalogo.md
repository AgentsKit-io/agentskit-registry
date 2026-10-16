---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: análise estática; configuração Doc Bridge lida, índice não gerado porque instalação não concluiu
fontes: ["scripts/build-registry.mjs", "scripts/generate-catalog.mjs", "scripts/validate-catalog.mjs", "package.json", "docs/for-agents/registry-catalog.md", "AGENTS.md"]
tags: [pacote, repo/agentskit-registry, camada/ferramenta]
---

# registry-catalogo

> [!tldr] Em linguagem comum
> Mantém a lista de agentes e transforma fontes legíveis em pacotes JSON instaláveis pelo CLI.

← [[00 Hub - agentskit-registry]]

## O que faz e por que existe

O gerador percorre `registry/`, valida metadados e incorpora os arquivos indicados em bundles; gera índices públicos e projeções para consumidores. O catálogo amplo inclui ciclo draft/validated, enquanto só agentes válidos e instaláveis entram no índice de instalação (scripts/build-registry.mjs:5; scripts/build-registry.mjs:142; CONTRIBUTING.md:35).

## API e contratos

| Símbolo | Tipo | Para que serve | Onde |
|---|---|---|---|
| `scripts/build-registry.mjs` | CLI Node ESM | Gera bundles, índices, llms e conhecimento determinístico | package.json:14 |
| `scripts/generate-catalog.mjs` | CLI Node ESM | Gera manifesto do catálogo | package.json:18 |
| `scripts/validate-catalog.mjs` | CLI Node ESM | Confere catálogo | package.json:19 |

Exemplo real: `npm run build` executa `node scripts/build-registry.mjs && node scripts/generate-ecosystem-claims.mjs` (package.json:14).

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-validacao]] | valida fontes e catálogo antes da geração |
| CLI AgentsKit | consome os bundles e índice para copiar código (docs/architecture.md:30) |
| [[00 Hub - agentskit]] | hospeda a experiência visual consumidora, conforme documentação |
| `catalog/manifest.json` | agrega especificações e estados de agentes (scripts/build-registry.mjs:29) |

## Dados e efeitos

Lê `registry/<id>/meta.json`, fontes declaradas, evidência de `validation/` e `catalog/`; grava `public/r/`, `public/deterministic/` e arquivos llms (scripts/build-registry.mjs:21; scripts/build-registry.mjs:327). Não declara variáveis de ambiente nem acesso de rede no gerador citado. Não requer banco. Saídas são públicas; nunca inserir segredos, prompts privados ou parecer bruto (AGENTS.md:15).

## Como mexer (para agentes)

- Entrada: `scripts/build-registry.mjs`; contrato de contribuição: `CONTRIBUTING.md`.
- Preserve a geração determinística e não edite `public/r` manualmente (AGENTS.md:9).
- Para catálogo: `npm run catalog:validate`; para build completo: `npm run build`; validação combinada: `npm run validate` (package.json:14; package.json:19; package.json:28).
- Bundle de draft deve permanecer não instalável (scripts/build-registry.mjs:141).
- CI verifica diff de artefatos gerados (`.github/workflows/ci.yml`:40).

## Decisões e história

Não há ADR em `docs/adr/` neste repositório. O limite arquitetural mantém fonte/catálogo aqui e instalação/aplicação em consumidores (docs/architecture.md:3; docs/architecture.md:25).

| Data | Commit | Mudança relevante |
|---|---|---|
| 2026-09-25 | f3fd4cd | sincroniza ordem canônica do catálogo do ecossistema |
| 2026-07-09 | 5201c69 | introduz manifesto mestre e ciclo draft/validated |



## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/build-registry.mjs:25` declara campos mínimos.
> - `scripts/build-registry.mjs:142` grava draft como não instalável.
> - `scripts/build-registry.mjs:193` compõe o índice.
> - `docs/for-agents/registry-catalog.md:1` aponta fontes canônicas e comandos.

> [!bug] Existe, mas ninguém usa
> Não foi possível confirmar capacidades do catálogo que não tenham consumidores; nenhuma será classificada como não usada sem evidência.
