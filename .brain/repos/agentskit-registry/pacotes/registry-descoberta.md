---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits:
  agentskit: 779aa601
  agentskit-chat: 8aeeffd
  agentskit-registry: 49952c7
metodo: análise estática; nada foi executado
fontes: ["agentskit-registry/scripts/lib/deterministic-discovery.mjs", "agentskit-registry/scripts/build-discovery.mjs", "agentskit-registry/scripts/build-registry.mjs"]
tags: [pacote, repo/agentskit-registry]
---

# registry-descoberta

> [!tldr] Em linguagem comum
> Transforma o catálogo em fatos que pessoas, ferramentas e interfaces podem consultar. Inclui arquivos para busca exata local, com formato e integridade conferidos pelo AgentsKit Chat.

← [[00 Hub - agentskit-registry]]

## Papel e relações

| Relação | O que faz | Outra peça |
|---|---|---|
| Lê | Metadados de agentes e manifesto. | [[registry-catalogo]] |
| Depende de | Schemas e hash do protocolo compartilhado. | [[chat-protocol]] |
| Serve a | Widget do site e material legível por agentes. | [[agentskit-registry]] |

## Dados e limites

Os dados de entrada são arquivos versionados e as saídas são artefatos públicos reproduzíveis. Não há banco operacional obrigatório. Revisões brutas privadas e credenciais não pertencem aos bundles públicos. A infraestrutura que atende esses arquivos não é demonstrada por este módulo.

> [!info]- Detalhe técnico
> - `agentskit-registry/scripts/lib/deterministic-discovery.mjs:65` — artefato
> - `agentskit-registry/scripts/lib/deterministic-discovery.mjs:222` — configuração do site
> - `agentskit-registry/scripts/build-discovery.mjs:13` — gravação em public/deterministic
> - `agentskit-registry/scripts/build-registry.mjs:282` — endereços dos índices e bundles
