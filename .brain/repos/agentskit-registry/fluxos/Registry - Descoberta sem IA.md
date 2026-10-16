---
tipo: fluxo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: análise estática do código e arquitetura; índice Doc Bridge não pôde ser gerado
fontes: ["scripts/lib/deterministic-discovery.mjs", "scripts/build-discovery.mjs", "docs/architecture.md", "AGENTS.md"]
tags: [fluxo, repo/agentskit-registry, camada/ferramenta]
---

# Registry - Descoberta sem IA

> [!tldr] Em linguagem comum
> Fatos exatos sobre agentes são empacotados num artefato determinístico; perguntas que exigem interpretação seguem para o backend autenticado.

← [[00 Hub - agentskit-registry]]

## Etapas

| Etapa | Comportamento |
|---|---|
| Fonte | Lê metadados não draft e manifesto (`scripts/lib/deterministic-discovery.mjs:212`) |
| Construção | Ordena agentes e remove aliases com mais de um dono (`scripts/lib/deterministic-discovery.mjs:65`) |
| Escrita | `npm run discovery:build` produz knowledge e site config (`scripts/build-discovery.mjs:11`; package.json:15) |
| Consumo | Protocolo compartilhado verifica artefato; aplicação responde consultas exatas (`docs/architecture.md:27; 46-52`) |
| Escalada | Questões semânticas seguem ao backend somente após miss validado (`docs/architecture.md:15; 50-52`) |

## Limites e efeitos

Não há fuzzy match, ranking, comparação ou recomendação local. O SHA-256 verifica integridade de conteúdo, sem comprovar autoria (docs/architecture.md:27; 48-55). A saída é pública, local e reproduzível.

> [!info]- Detalhe técnico
> O pacote `@agentskit/chat@0.4.1` é dependência exata e fornece o subpath do protocolo (package.json:43; docs/architecture.md:36).
