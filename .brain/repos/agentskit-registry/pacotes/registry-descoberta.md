---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: análise estática do código e dependência declarada; Doc Bridge index não disponível por instalação bloqueada; auditado em 2026-10-16
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

Exemplo real: `npm run discovery:build` executa `node scripts/build-discovery.mjs` (package.json:15). Trecho real (scripts/build-discovery.mjs:13-14):

```js
const result = await createRegistryDiscoveryArtifact(readRegistryDiscoverySource(root))
const siteConfig = createRegistrySiteConfig(result.artifact.contentHash)
```

O bundle (`npm run build`) grava os mesmos dois arquivos (scripts/build-registry.mjs:327-331).

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-catalogo]] | fornece metadados canônicos (`readRegistryDiscoverySource` lê `registry/*/meta.json` e `catalog/manifest.json`) |
| `scripts/build-registry.mjs` | consumidor interno: importa as três funções (scripts/build-registry.mjs:14-18) e grava os arquivos (:324-331) |
| `scripts/build-discovery.mjs` | consumidor interno: importa as mesmas funções (scripts/build-discovery.mjs:5-9) |
| [[00 Hub - agentskit-chat]] | fornece protocolo compartilhado importado de `@agentskit/chat/protocol` (scripts/lib/deterministic-discovery.mjs:3-12) |
| `@agentskit/chat` | versão exata 0.4.1 (package.json:43); a verificação de integridade do artefato é feita pelo consumidor (docs/architecture.md:27-29) |
| Aplicação Registry no AgentsKit | consome configuração/artefato e apresenta fallback do backend (docs/architecture.md:3-6; scripts/lib/deterministic-discovery.mjs:222-231, fallback em :230) |

## Dados e efeitos

Lê `registry/*/meta.json` e `catalog/manifest.json`, ignora agentes draft (scripts/lib/deterministic-discovery.mjs:212-220) e grava arquivos públicos em `public/deterministic/` (scripts/build-registry.mjs:327-331). Não há variáveis de ambiente, credenciais, banco ou chamadas de rede nestas funções. O artefato recebe `contentHash` (deterministic-discovery.mjs:202-203) e falha se passar do limite de bytes (:206-208). O limite de 1.024 entradas e 512 KiB vem da doc de arquitetura (docs/architecture.md:54-55); o código só checa bytes. Artefato contém dados catalogados públicos.

## Como mexer (para agentes)

- Entrada: `scripts/lib/deterministic-discovery.mjs`; invocadores: `scripts/build-discovery.mjs` e `scripts/build-registry.mjs`.
- Preserve ordenação estável (:66), alias único (:77) e exclusão de drafts (:217).
- Não implemente protocol schemas localmente; não introduza fuzzy match (AGENTS.md:7-11).
- Valide com `npm run discovery:build` (package.json:15), `npm test` (package.json:30) e `npm run check:no-legacy-chat-imports` (package.json:33). Atenção: `npm test` roda `pretest` antes, que reexecuta `discovery:build` (package.json:29) e reescreve `public/deterministic/`.
- Testes desta parte: `scripts/lib/deterministic-discovery.test.mjs`.
- CI também exige `npm run build` e Doc Bridge gate (`.github/workflows/ci.yml:35-37`).

## Decisões e história

Não há ADR local em `docs/adr/`. Protocolo fica upstream, importado de release publicada; Registry gera os dados (docs/architecture.md:17).

| Data | Commit | Mudança |
|---|---|---|
| 2026-09-02 | 6bdae66 | consolida remediação Registry (#144); toca estes caminhos |
| 2026-07-14 | 513fee1 | migra discovery para `@agentskit/chat/protocol` (#80) |
| 2026-07-13 | 2281a0c | adiciona artefato determinístico Registry (#78) |

Histórico: `git log -- scripts/lib/deterministic-discovery.mjs scripts/build-discovery.mjs` (3 commits, os mais recentes da tabela).

## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/lib/deterministic-discovery.mjs:65` ordena fontes e remove aliases ambíguos.
> - `scripts/lib/deterministic-discovery.mjs:88` forma entradas para agentes.
> - `scripts/lib/deterministic-discovery.mjs:212` lê fontes; `:222` cria a configuração de fallback.
> - `scripts/build-registry.mjs:327-331` escreve os dois artefatos determinísticos.

> [!question] Dúvida
> Consumidores dentro deste repo estão listados acima. Consumidores fora dele (o site em `AgentsKit-io/agentskit/apps/registry`, README.md:131-134) não foram verificados nesta worktree.
