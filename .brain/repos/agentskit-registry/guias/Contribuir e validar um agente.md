---
tipo: guia
repo: agentskit-registry
camada: ferramenta
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: extraído de CONTRIBUTING.md, AGENTS.md e scripts versionados; sem execução
fontes: ["CONTRIBUTING.md", "AGENTS.md", "package.json"]
tags: [guia, repo/agentskit-registry, camada/ferramenta]
---

# Contribuir e validar um agente

> [!tldr] Em linguagem comum
> Guia passo a passo: Contribuir e validar um agente.

← [[00 Hub - agentskit-registry]]

## Quando usar

Ao criar ou alterar agente versionado em `registry/<id>/` (CONTRIBUTING.md:12).

## Pré-requisitos

Node compatível; CI declara Node 22. Copie o formato de um agente validado e não inclua segredos, prompts privados ou dados de clientes (CONTRIBUTING.md:9; .github/workflows/ci.yml:20).

## Passos

1. Crie `agent.ts`, `meta.json`, `agent.test.ts` e `README.md` (CONTRIBUTING.md:12).
2. Confira a política do catálogo e os campos obrigatórios (`npm run validate`; package.json:28).
3. Rode `npm run lint` e `npm test` (package.json:30).
4. Rode replay: `npm run eval:run -- --ecosystem-doc-bridge` (AGENTS.md:31; package.json:23).
5. Gere bundles: `npm run build`; rode `npm run docs:bridge:index` e `npm run docs:bridge:gate` (AGENTS.md:23).
6. Revise `git diff -- public ecosystem-claims.json .doc-bridge` para confirmar artefatos atualizados ( .github/workflows/ci.yml:39).

## Como validar

CI também roda `npm run check:no-legacy-chat-imports`, `npm run test:quickstart` e `npm run docs:bridge:conformance` (.github/workflows/ci.yml:25).

## Erros comuns

- Draft não pode aparecer como instalável (AGENTS.md:15).
- Não edite saídas geradas à mão (AGENTS.md:13).
- Não reimplemente runtime, protocolo de chat ou fuzzy matching (AGENTS.md:9).
- Claims validados requerem evidência pública (AGENTS.md:15).

## Notas relacionadas

[[registry-validacao]], [[registry-catalogo]], [[Registry - Da contribuição ao bundle]]
