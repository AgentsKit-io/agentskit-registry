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
fontes: ["agentskit-registry/scripts/build-registry.mjs"]
tags: [pacote, repo/agentskit-registry]
---

# registry-catalogo

> [!tldr] Em linguagem comum
> É a prateleira de agentes prontos: cada pasta traz código, teste, metadados e explicação. O catálogo entrega cópias de código ao projeto do usuário, sem impor um runtime próprio.

← [[00 Hub - agentskit-registry]]

## Papel e relações

| Relação | O que faz | Outra peça |
|---|---|---|
| Guarda | Fontes registry/<id>, catalog/manifest.json e evidências públicas. | [[00 Hub - agentskit-registry]] |
| Entrega | Bundles public/r/<id>.json, índices e material de navegação. | [[agentskit-cli]] |
| Apresentado por | Galeria e páginas de agentes ficam no outro monorepo. | [[agentskit-registry]] |

## Dados e limites

Os dados de entrada são arquivos versionados e as saídas são artefatos públicos reproduzíveis. Não há banco operacional obrigatório. Revisões brutas privadas e credenciais não pertencem aos bundles públicos. A infraestrutura que atende esses arquivos não é demonstrada por este módulo.

> [!info]- Detalhe técnico
> - `agentskit-registry/scripts/build-registry.mjs:25` — campos obrigatórios
> - `agentskit-registry/scripts/build-registry.mjs:58` — fontes incorporadas
> - `agentskit-registry/scripts/build-registry.mjs:89` — flow.json opcional
> - `agentskit-registry/scripts/build-registry.mjs:142` — draft e installable
> - `agentskit-registry/scripts/build-registry.mjs:235` — limpeza de bundles órfãos
