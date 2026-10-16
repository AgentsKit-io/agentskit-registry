---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: análise estática do código e dependência declarada; Doc Bridge index não disponível por instalação bloqueada
fontes: ["scripts/lib/deterministic-discovery.mjs", "scripts/build-discovery.mjs", "scripts/build-registry.mjs", "docs/architecture.md", "package.json"]
tags: [pacote, repo/agentskit-registry, camada/ferramenta]
---

# registry-descoberta

> [!tldr] Em linguagem comum
> Gera um arquivo de conhecimento verificável para responder fatos exatos do catálogo localmente e encaminhar questões semânticas ao sistema responsável.

← [[00 Hub - agentskit-registry]]

## O que faz e por que existe

Ordena agentes, cria aliases sem colisão e constrói artefato e configuração do site. O protocolo e a verificação pertencem a `@agentskit/chat/protocol`; Registry não recria busca fuzzy, ranking ou recomendação semântica (scripts/lib/deterministic-discovery.mjs:3; 65-78; docs/architecture.md:29).

## API e contratos

| Símbolo | Tipo | Para que serve | Onde |
|---|---|---|---|
| `createRegistryDiscoveryArtifact({ agents, generatedAt })` | função async | Produz artefato determinístico validado e serializado | scripts/lib/deterministic-discovery.mjs:65 |
| `readRegistryDiscoverySource(root)` | função | Lê metadados e manifesto, removendo drafts | scripts/lib/deterministic-discovery.mjs:212 |
| `createRegistrySiteConfig(contentHash)` | função | Cria configuração que aponta ao artefato | scripts/lib/deterministic-discovery.mjs:222 |

Exemplo real: `npm run discovery:build` executa `node scripts/build-discovery.mjs` (package.json:15); o bundle também gera `knowledge.json` e `site-config.json` (scripts/build-registry.mjs:325).

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-catalogo]] | fornece metadados canônicos |
| [[00 Hub - agentskit-chat]] | fornece protocolo compartilhado importado de `@agentskit/chat/protocol` (scripts/lib/deterministic-discovery.mjs:3) |
| `@agentskit/chat` | versão exata 0.4.1 no ambiente de desenvolvimento (package.json:43) |
| Aplicação Registry no AgentsKit | consome configuração/artefato e apresenta fallback do backend (docs/architecture.md:3; scripts/lib/deterministic-discovery.mjs:222) |

## Dados e efeitos

Lê `registry/*/meta.json` e `catalog/manifest.json`, ignora agentes draft e grava arquivos públicos em `public/deterministic/` (scripts/lib/deterministic-discovery.mjs:212; scripts/build-registry.mjs:325). Não há variáveis de ambiente, credenciais, banco ou chamadas de rede declaradas nestas funções. Artefato contém dados catalogados públicos; SHA-256 detecta alteração do conteúdo mas não comprova autoria (docs/architecture.md:19).

## Como mexer (para agentes)

- Entrada: `scripts/lib/deterministic-discovery.mjs`; invocador: `scripts/build-discovery.mjs`.
- Preserve ordenação estável, alias único e exclusão de drafts (linhas acima).
- Não implemente protocol schemas localmente; não introduza fuzzy match (AGENTS.md:7).
- Valide com `npm run discovery:build`, `npm test`, `npm run check:no-legacy-chat-imports` (package.json:15; 30; 33).
- CI também exige `npm run build` e Doc Bridge gate (`.github/workflows/ci.yml:35).

## Decisões e história

Não há ADR local em `docs/adr/`. Protocolo fica upstream, importado de release publicada; Registry gera os dados (docs/architecture.md:17).

| Data | Commit | Mudança |
|---|---|---|
| 2026-07-14 | 513fee1 | migra discovery para `@agentskit/chat/protocol` |
| 2026-07-13 | 2281a0c | adiciona artefato determinístico Registry |

Resumo do log mais recente nos caminhos `scripts/lib/deterministic-discovery.mjs` e `scripts/build-discovery.mjs`.

## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/lib/deterministic-discovery.mjs:65` ordena fontes e remove aliases ambíguos.
> - `scripts/lib/deterministic-discovery.mjs:88` forma entradas para agentes.
> - `scripts/lib/deterministic-discovery.mjs:212` lê fontes e produz configuração de fallback.
> - `scripts/build-registry.mjs:325` escreve os dois artefatos determinísticos.

> [!bug] Existe, mas ninguém usa
> Não confirmado. A relação completa de consumidores deveria ser extraída do índice Doc Bridge quando ele puder ser gerado.
