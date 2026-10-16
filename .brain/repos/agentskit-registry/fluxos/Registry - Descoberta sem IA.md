---
tipo: fluxo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits:
  agentskit: 779aa601
  agentskit-chat: 8aeeffd
  agentskit-registry: 49952c7
metodo: análise estática; nada foi executado
fontes: ["agentskit-registry/scripts/lib/deterministic-discovery.mjs", "agentskit-registry/scripts/build-discovery.mjs", "agentskit-registry/docs/architecture.md"]
tags: [fluxo, repo/agentskit-registry]
---

# Registry - Descoberta sem IA

> [!tldr] Em linguagem comum
> O catálogo produz uma lista verificada de fatos exatos para a interface responder sem gastar uma chamada de IA. Recomendações e comparações de significado continuam sendo trabalho do backend.

← [[00 Hub - agentskit-registry]]

```mermaid
flowchart LR
  M[Metadados] --> A[Artefato com hash]
  A --> V[Verificação no cliente]
  V --> Q[Consulta exata]
  Q --> R[Resposta ou escolhas]
  Q --> B[Escalada validada ao Ask]
```

## Passo a passo

| Passo | O que acontece | Quem atua |
|---|---|---|
| Fonte | Lê metadados e manifesto do catálogo. | [[registry-catalogo]] |
| Artefato | Monta entradas e configuração de site com hash de conteúdo. | [[registry-descoberta]] |
| Contrato | Reutiliza schemas e verificação de integridade do AgentsKit Chat. | [[chat-protocol]] |
| Site | Carrega e verifica o artefato antes de montar o widget. | [[agentskit-registry]] |
| Escalada | Somente uma ausência validada encaminha a pergunta semântica. | [[chat]] |

## Limites e dados

O hash SHA-256 detecta alteração de conteúdo e vincula configuração ao artefato; não é, por si só, assinatura criptográfica de autoria. A expressão “signed local artifact” do README deve ser lida com essa distinção. O código do protocolo é reutilizado, não copiado.

> [!info]- Detalhe técnico
> - `agentskit-registry/scripts/lib/deterministic-discovery.mjs:65` — criação do artefato
> - `agentskit-registry/scripts/lib/deterministic-discovery.mjs:212` — fontes canônicas
> - `agentskit-registry/scripts/build-discovery.mjs:13` — geração e gravação de knowledge e site-config
> - `agentskit-registry/docs/architecture.md:46` — limite da busca determinística
