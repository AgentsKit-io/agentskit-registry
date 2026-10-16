---
tipo: guia
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: extraído dos scripts, package.json e workflow; sem execução; auditado em 2026-10-16
fontes: ["package.json", "scripts/build-registry.mjs", "scripts/build-discovery.mjs", "scripts/generate-catalog.mjs", "AGENTS.md", ".github/workflows/ci.yml"]
tags: [guia, repo/agentskit-registry, camada/ferramenta]
---

# Regenerar catálogo e descoberta

> [!tldr] Em linguagem comum
> Como regenerar os arquivos públicos de catálogo e descoberta depois de mudar fontes, metadados ou a lógica do build.

← [[00 Hub - agentskit-registry]]

## Quando usar

Após mudar fonte de catálogo, evidência, metadados ou lógica de descoberta. Artefatos públicos são gerados (AGENTS.md:13).

## Pré-requisitos

Dependências do projeto instaladas (`npm ci`, como no CI). A CLI `ak-docs` vem de `@agentskit/doc-bridge` (package.json:46; AGENTS.md:21-26).

## Passos

1. `npm run docs:bridge:config` gera a configuração de ownership usada pelo Doc Bridge (package.json:17; `.github/workflows/ci.yml:26-27`).
2. `npm run catalog:generate` só se o manifesto precisar ser recriado (package.json:18). Atenção: ele reescreve `catalog/manifest.json` a partir da lista fixa de `scripts/generate-catalog.mjs`, com todo spec em `status: 'draft'` (scripts/generate-catalog.mjs:21) e `generatedAt` novo (:464). Revise o diff antes de commitar.
3. `npm run catalog:validate` para conferir o catálogo contra a política (package.json:19).
4. `npm run build` para gerar bundles e claims (package.json:14).
5. `npm run discovery:build` para gerar knowledge e site config determinísticos (package.json:15; scripts/build-discovery.mjs:16-18).
6. `npm run docs:bridge:index` e `npm run docs:bridge:gate` (package.json:34-35).

## Como validar

Rode `npm run validate`, `npm run lint`, `npm test`, `npm run eval:run -- --ecosystem-doc-bridge`, `npm run build` e os gates Doc Bridge conforme AGENTS.md:31-32. O CI confirma ausência de diff em `public`, `ecosystem-claims.json`, `doc-bridge.config.json` e `.doc-bridge` (`.github/workflows/ci.yml:39-40`).

## Erros comuns

- Não editar `public/r/`, `public/deterministic/`, `ecosystem-claims.json` ou `.doc-bridge` manualmente (AGENTS.md:13).
- Mudanças de descoberta não devem introduzir lógica semântica local (AGENTS.md:11).
- Indexação Doc Bridge depende da configuração de ownership gerada no CI (`.github/workflows/ci.yml:26-27`).
- `npm run build` apaga em `public/r/` os `.json` sem pasta correspondente em `registry/` (scripts/build-registry.mjs:238-244).

## Notas relacionadas

[[registry-catalogo]], [[registry-descoberta]], [[Registry - Descoberta sem IA]]
