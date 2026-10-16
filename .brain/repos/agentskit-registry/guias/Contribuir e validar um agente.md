---
tipo: guia
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: extraído de CONTRIBUTING.md, AGENTS.md e scripts versionados; sem execução; auditado em 2026-10-16
fontes: ["CONTRIBUTING.md", "AGENTS.md", "package.json", ".github/workflows/ci.yml"]
tags: [guia, repo/agentskit-registry, camada/ferramenta]
---

# Contribuir e validar um agente

> [!tldr] Em linguagem comum
> Como adicionar um agente ao Registry, da pasta até o pull request, passando pelas validações que o CI repete.

← [[00 Hub - agentskit-registry]]

## Quando usar

Ao criar ou alterar agente versionado em `registry/<id>/` (CONTRIBUTING.md:12).

## Pré-requisitos

Node compatível; o CI declara Node 22 (`.github/workflows/ci.yml:22`). Use um agente validado vizinho como referência (README.md:140-141) e não inclua segredos, prompts privados ou dados de clientes (CONTRIBUTING.md:9-10).

## Passos

1. Crie `agent.ts`, `meta.json`, `agent.test.ts` e `README.md` (CONTRIBUTING.md:12-17). Para promover a `validated`, adicione também `eval.ts` (CONTRIBUTING.md:44-45); a validação estrutural não exige esse arquivo (scripts/validate-agents.mjs:14).
2. Confira a política do catálogo e os campos obrigatórios com `npm run validate` (package.json:28).
3. Rode `npm run lint` e `npm test` (package.json:30-32). Atenção: `npm test` roda antes o `pretest`, que regenera `public/deterministic/` (package.json:29).
4. Rode o replay: `npm run eval:run -- --ecosystem-doc-bridge` (package.json:23; scripts/run-eval.mjs:12).
5. Gere os artefatos: `npm run build` (package.json:14); depois `npm run docs:bridge:index` e `npm run docs:bridge:gate` (package.json:34-35).
6. Revise `git diff -- public ecosystem-claims.json doc-bridge.config.json .doc-bridge` para confirmar que os artefatos estão atualizados (`.github/workflows/ci.yml:39-40`).

## Como validar

CI também roda `npm run check:no-legacy-chat-imports` (`.github/workflows/ci.yml:25`), `npm run test:quickstart` (`:32`) e `npm run docs:bridge:conformance` (`:38`). Antes disso, o CI regenera a configuração de ownership com `npm run docs:bridge:config` (`:26-27`).

## Erros comuns

- Draft não pode aparecer como instalável (AGENTS.md:15).
- Não edite saídas geradas à mão (AGENTS.md:13).
- Não reimplemente runtime, protocolo de chat ou fuzzy matching (AGENTS.md:9-11).
- Claims validados requerem evidência pública (AGENTS.md:15).

## Notas relacionadas

[[registry-validacao]], [[registry-catalogo]], [[Registry - Da contribuição ao bundle]]
