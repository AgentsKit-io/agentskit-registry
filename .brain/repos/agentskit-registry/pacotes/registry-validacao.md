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
fontes: ["agentskit-registry/scripts/validate-agents.mjs", "agentskit-registry/scripts/validate-external-agents.mjs", "agentskit-registry/scripts/lib/external-agent-validation.mjs", "agentskit-registry/scripts/lib/validation-evidence.mjs", "agentskit-registry/scripts/run-eval.mjs", "agentskit-registry/action.yml"]
tags: [pacote, repo/agentskit-registry]
---

# registry-validacao

> [!tldr] Em linguagem comum
> É o controle de entrada do catálogo: verifica estrutura e conteúdo e mantém avaliações reproduzíveis. Uma pasta válida não significa um agente aprovado para qualquer uso real.

← [[00 Hub - agentskit-registry]]

## Papel e relações

| Relação | O que faz | Outra peça |
|---|---|---|
| Verifica | Arquivos, metadados e referências; testes e replay fazem checks diferentes. | [[registry-catalogo]] |
| Reutiliza | O pipeline de replay do framework para avaliação. | [[agentskit-eval]] |
| Exporta | Só resumos sanitizados de revisão entram no catálogo público. | [[registry-descoberta]] |

## Dados e limites

Os dados de entrada são arquivos versionados e as saídas são artefatos públicos reproduzíveis. Não há banco operacional obrigatório. Revisões brutas privadas e credenciais não pertencem aos bundles públicos. A infraestrutura que atende esses arquivos não é demonstrada por este módulo.

> [!info]- Detalhe técnico
> - `agentskit-registry/scripts/validate-agents.mjs:14` — contrato estrutural
> - `agentskit-registry/scripts/validate-external-agents.mjs:1` — entrada da GitHub Action
> - `agentskit-registry/scripts/lib/external-agent-validation.mjs:1` — validação externa e política de conteúdo
> - `agentskit-registry/scripts/lib/validation-evidence.mjs:1` — leitura e saneamento de evidências
> - `agentskit-registry/scripts/run-eval.mjs:1` — avaliação/replay
> - `agentskit-registry/action.yml:15` — action composite sem chamada a IA
