---
tipo: fluxo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: análise estática; Doc Bridge configurado, indexação não realizada
fontes: ["CONTRIBUTING.md", "scripts/validate-agents.mjs", "scripts/build-registry.mjs", "package.json", "AGENTS.md"]
tags: [fluxo, repo/agentskit-registry, camada/ferramenta]
---

# Registry - Da contribuição ao bundle

> [!tldr] Em linguagem comum
> Uma contribuição adiciona uma pasta de agente com fonte, metadados, testes e instruções; os validadores e o build produzem artefatos reproduzíveis para instalação.

← [[00 Hub - agentskit-registry]]

## Etapas

| Etapa | Ação | Evidência |
|---|---|---|
| Criar fonte | `registry/<id>/agent.ts`, `meta.json`, `agent.test.ts`, `README.md` | CONTRIBUTING.md:12 |
| Validar | Executar validação estrutural e catálogo | package.json:28 |
| Testar | TypeScript, Vitest e replay de eval conforme mudança | package.json:23 |
| Construir | Gerar bundles e claims | package.json:14 |
| Conferir | Rodar Doc Bridge e garantir ausência de diff gerado | AGENTS.md:23 |

## Limites e efeitos

Os drafts permanecem não instaláveis; status validado exige evidência pública (scripts/build-registry.mjs:141; AGENTS.md:15). Os arquivos em `public/` são gerados e não devem receber edição manual (AGENTS.md:13).

> [!info]- Detalhe técnico
> `scripts/validate-agents.mjs:13` define arquivos e campos mínimos. `scripts/build-registry.mjs:193` escreve o índice público. O CI usa Node 22 (`.github/workflows/ci.yml:20`).
