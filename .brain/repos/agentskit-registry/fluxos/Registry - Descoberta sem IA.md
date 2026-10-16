---
tipo: fluxo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: análise estática do código e arquitetura; índice Doc Bridge não pôde ser gerado; auditado em 2026-10-16
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
| Fonte | Lê metadados não draft e manifesto (`scripts/lib/deterministic-discovery.mjs:212-220`) |
| Construção | Ordena agentes e remove aliases com mais de um dono (`scripts/lib/deterministic-discovery.mjs:65`, `:77`) |
| Escrita | `npm run discovery:build` produz knowledge e site config (`scripts/build-discovery.mjs:16-18`; package.json:15) |
| Consumo | Protocolo compartilhado verifica o artefato; aplicação responde consultas exatas (`docs/architecture.md:27-29; 46-52`) |
| Escalada | Questões semânticas seguem ao backend somente após miss validado (`docs/architecture.md:15-17; 50-52`) |

## Limites e efeitos

Não há fuzzy match, ranking, comparação ou recomendação local (docs/architecture.md:46-50). O hash de conteúdo do artefato permite detectar alteração (docs/architecture.md:27-29). A saída é pública, local e reproduzível.

> [!info]- Detalhe técnico
> O pacote `@agentskit/chat@0.4.1` é dependência exata e fornece o subpath do protocolo (package.json:43; docs/architecture.md:36).
