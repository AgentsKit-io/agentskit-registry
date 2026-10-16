---
tipo: guia
repo: agentskit-registry
camada: ferramenta
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: extraído dos scripts, package.json e workflow; sem execução
fontes: ["package.json", "scripts/build-registry.mjs", "scripts/build-discovery.mjs", "AGENTS.md", ".github/workflows/ci.yml"]
tags: [guia, repo/agentskit-registry, camada/ferramenta]
---

# Regenerar catálogo e descoberta

> [!tldr] Em linguagem comum
> Guia passo a passo: Regenerar catálogo e descoberta.

← [[00 Hub - agentskit-registry]]

## Quando usar

Após mudar fonte de catálogo, evidência, metadados ou lógica de descoberta. Artefatos públicos são gerados (AGENTS.md:13).

## Pré-requisitos

Dependências do projeto instaladas; CLI `ak-docs` disponível como dependência de desenvolvimento (package.json:42).

## Passos

1. `npm run catalog:generate` se o manifesto catalogado precisar ser recriado (package.json:18).
2. `npm run catalog:validate` para conferir catálogo (package.json:19).
3. `npm run build` para gerar bundles e claims (package.json:14).
4. `npm run discovery:build` para gerar knowledge/site config determinísticos (package.json:15; scripts/build-discovery.mjs:11).
5. `npm run docs:bridge:index` e `npm run docs:bridge:gate` (package.json:34).

## Como validar

Rode `npm run validate`, `npm run lint`, `npm test`, `npm run eval:run -- --ecosystem-doc-bridge`, `npm run build` e os gates Doc Bridge conforme AGENTS.md:31. CI confirma ausência de diff em `public`, claims, configuração e índice (`.github/workflows/ci.yml:39).

## Erros comuns

- Não editar `public/r`, `public/deterministic`, `ecosystem-claims.json` ou `.doc-bridge` manualmente (AGENTS.md:13).
- Mudanças de descoberta não devem introduzir lógica semântica local (AGENTS.md:11).
- Indexação Doc Bridge depende da configuração de ownership gerada durante CI (`.github/workflows/ci.yml:25).

## Notas relacionadas

[[registry-catalogo]], [[registry-descoberta]], [[Registry - Descoberta sem IA]]
