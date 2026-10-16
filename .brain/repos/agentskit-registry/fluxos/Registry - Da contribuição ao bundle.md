---
tipo: fluxo
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: análise estática; Doc Bridge configurado, indexação não realizada; auditado em 2026-10-16
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
| Criar fonte | `registry/<id>/agent.ts`, `meta.json`, `agent.test.ts`, `README.md`; `eval.ts` para promover a validated | CONTRIBUTING.md:12-17; CONTRIBUTING.md:44-45 |
| Validar | Executar validação estrutural e catálogo | package.json:28 |
| Testar | TypeScript, Vitest e replay de eval conforme mudança | package.json:23; package.json:30 |
| Construir | Gerar bundles e claims | package.json:14 |
| Conferir | Rodar Doc Bridge e garantir ausência de diff gerado | AGENTS.md:23-26; .github/workflows/ci.yml:39-40 |

## Limites e efeitos

Drafts permanecem não instaláveis (scripts/build-registry.mjs:141-144). Status `validated` exige evidência pública pela política (AGENTS.md:15), mas o build não bloqueia um `validated` sem evidência: só anexa a evidência se ela existir (scripts/build-registry.mjs:125-132). Os arquivos em `public/` são gerados e não devem receber edição manual (AGENTS.md:13).

> [!info]- Detalhe técnico
> `scripts/validate-agents.mjs:14-15` define arquivos e campos mínimos. `scripts/build-registry.mjs:193` escreve o índice público. O CI usa Node 22 (`.github/workflows/ci.yml:22`).
