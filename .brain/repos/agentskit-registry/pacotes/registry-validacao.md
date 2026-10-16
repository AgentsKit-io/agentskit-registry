---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 87c2ddc }
metodo: análise estática; configuração Doc Bridge lida, índice não gerado porque instalação não concluiu
fontes: ["scripts/validate-agents.mjs", "scripts/lib/external-agent-validation.mjs", "scripts/lib/validation-evidence.mjs", "scripts/run-eval.mjs", "scripts/export-validation-evidence.mjs", "action.yml", "package.json", "AGENTS.md"]
tags: [pacote, repo/agentskit-registry, camada/ferramenta]
---

# registry-validacao

> [!tldr] Em linguagem comum
> Confere se agentes seguem a estrutura e as políticas do catálogo, e controla quais evidências de avaliação podem ser publicadas.

← [[00 Hub - agentskit-registry]]

## O que faz e por que existe

Há validadores distintos para agentes internos e pastas externas, além de replay de avaliações e exportação de evidência. Validação estrutural, testes e evidência independente são sinais diferentes; não equivalem a garantia de segurança em produção (package.json:28; AGENTS.md:12).

## API e contratos

| Símbolo | Tipo | Para que serve | Onde |
|---|---|---|---|
| `validateExternalAgents(root, policy)` | função | Valida uma raiz externa segundo política | scripts/lib/external-agent-validation.mjs:52 |
| `resolveValidationRoot(workspace, inputPath)` | função | Resolve caminho de entrada da Action | scripts/lib/external-agent-validation.mjs:40 |
| `readValidationEvidence(root, agentId)` | função | Lê evidência disponível para um agente | scripts/lib/validation-evidence.mjs:12 |
| `normalizeValidationVerdict(verdict, run)` | função | Normaliza veredito de replay | scripts/lib/validation-evidence.mjs:41 |

Exemplo real de execução: `npm run validate` roda `scripts/validate-agents.mjs` e `scripts/validate-catalog.mjs` (package.json:28). Para uso como Action, `uses: AgentsKit-io/agentskit-registry@v1` e `with: path: agents` (README.md:43).

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-catalogo]] | só fontes verificadas devem ser promovidas ao catálogo instalável |
| `@agentskit/eval` | dependência de desenvolvimento do pipeline de replay (package.json:47) |
| `action.yml` | expõe validação de agentes em outro repositório |
| `validation/` | guarda evidência pública versionada (docs/for-agents/registry-validation.md:7) |

## Dados e efeitos

O validador lê arquivos locais, metadados e política; a Action anuncia que não envia fonte a API nem exige credenciais (README.md:43). A leitura/exportação de evidência sanitizada não autoriza publicar material bruto ou dados privados (AGENTS.md:15). Nenhuma variável de ambiente é declarada pelos pontos de entrada citados. Replay pode usar fixtures/cassettes locais, conforme scripts de eval (package.json:23).

## Como mexer (para agentes)

- Comece por `scripts/validate-agents.mjs`, `scripts/lib/external-agent-validation.mjs` e `scripts/lib/validation-evidence.mjs`.
- Estrutura interna exige `agent.ts`, `meta.json`, `agent.test.ts`, `README.md` e campos mínimos (scripts/validate-agents.mjs:13).
- Comandos: `npm run validate`; testes: `npm test`; replay: `npm run eval:run -- --ecosystem-doc-bridge`; lint: `npm run lint` (package.json:23; 28-32).
- Evidência privada, credenciais, prompts e consultas de usuários não podem entrar em artefatos (AGENTS.md:15).
- Para alteração externa, confira também `action.yml` e teste a Action com fixture; CI do projeto é `.github/workflows/ci.yml`.

## Decisões e história

Não existem ADRs locais em `docs/adr/`. A fronteira essencial é exigir evidência pública para claims validados e nunca publicar revisão bruta (AGENTS.md:12).

| Data | Commit | Mudança |
|---|---|---|
| 2026-09-02 | 6bdae66 | consolida remediação de validação Registry |
| 2026-08-30 | 82616de | adota verificação documental Doc Bridge |
| 2026-07-22 | d41e477 | adiciona Action reutilizável para validar agentes externos |
| 2026-07-13 | 1454316 | publica evidência independente de validação |

Resumo do log mais recente nos caminhos `scripts/validate-agents.mjs`, `scripts/lib/external-agent-validation.mjs` e `scripts/lib/validation-evidence.mjs`.

## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/validate-agents.mjs:13` define raiz e arquivos/campos exigidos.
> - `scripts/lib/external-agent-validation.mjs:40` resolve raiz e inicia a verificação externa.
> - `scripts/lib/validation-evidence.mjs:4` declara limites mínimos de score e confiança.
> - `action.yml:1` descreve a action composite e seus inputs/execução.

> [!bug] Existe, mas ninguém usa
> Sem índice Doc Bridge e sem inspeção completa dos consumidores de cada helper, não há base para afirmar que algum recurso esteja sem uso.
