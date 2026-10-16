---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: análise estática; configuração Doc Bridge lida, índice não gerado porque instalação não concluiu; auditado em 2026-10-16
fontes: ["scripts/validate-agents.mjs", "scripts/validate-external-agents.mjs", "scripts/lib/external-agent-validation.mjs", "scripts/lib/validation-evidence.mjs", "scripts/run-eval.mjs", "scripts/export-validation-evidence.mjs", "action.yml", "catalog/content-policy.json", "package.json", "AGENTS.md"]
tags: [pacote, repo/agentskit-registry, camada/ferramenta]
---

# registry-validacao

> [!tldr] Em linguagem comum
> Confere se agentes seguem a estrutura e as políticas do catálogo, e controla quais evidências de avaliação podem ser publicadas.

← [[00 Hub - agentskit-registry]]

## O que faz e por que existe

Há validadores distintos para agentes internos e pastas externas, além de replay de avaliações e exportação de evidência. Há duas implementações das regras estruturais: `scripts/validate-agents.mjs:14-15` (agentes do repo) e `scripts/lib/external-agent-validation.mjs:5-6` (Action para outros repositórios). Mudar uma não muda a outra. Validação estrutural, testes e evidência independente são sinais diferentes; não equivalem a garantia de segurança em produção (package.json:28; README.md:68-70).

## API e contratos

| Símbolo | Tipo | Para que serve | Onde |
|---|---|---|---|
| `validateExternalAgents(root, policy)` | função | Valida uma raiz externa segundo política; devolve `errors` e `agentCount` | scripts/lib/external-agent-validation.mjs:52 |
| `resolveValidationRoot(workspace, inputPath)` | função | Resolve caminho de entrada da Action e impede sair do workspace | scripts/lib/external-agent-validation.mjs:40 |
| `readValidationEvidence(root, agentId)` | função | Lê o veredito do revisor independente da última iteração de um agente | scripts/lib/validation-evidence.mjs:12 |
| `normalizeValidationVerdict(verdict, run)` | função | Aplica o limite do revisor (aprovado, score, confiança, sem falhas críticas); devolve `null` se não passar | scripts/lib/validation-evidence.mjs:41 |
| `scripts/validate-external-agents.mjs` | CLI Node ESM | Entrada da Action: recebe workspace e caminho por argv e lê `catalog/content-policy.json` | scripts/validate-external-agents.mjs:8-9, :18; action.yml:22 |

Exemplo real: `npm run validate` roda `scripts/validate-agents.mjs` e `scripts/validate-catalog.mjs` (package.json:28). Como Action, o uso é `uses: AgentsKit-io/agentskit-registry@v1` com `with: path: agents` (README.md:59-61). O comando que a Action executa (action.yml:22):

```yaml
run: node "$GITHUB_ACTION_PATH/scripts/validate-external-agents.mjs" "$GITHUB_WORKSPACE" "$AGENT_VALIDATION_PATH"
```

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-catalogo]] | só fontes verificadas devem ser promovidas ao catálogo instalável (AGENTS.md:15); `scripts/build-registry.mjs:13` importa `readValidationManifest` deste módulo |
| `@agentskit/eval` | dependência de desenvolvimento do pipeline de replay (package.json:47); `scripts/run-eval.mjs:17` importa `@agentskit/eval/ci` |
| `action.yml` | expõe validação de agentes em outro repositório e chama `scripts/validate-external-agents.mjs` (action.yml:22) |
| `validation/` | guarda evidência pública versionada, em `validation/evidence.json` (docs/for-agents/registry-validation.md:10) |

## Dados e efeitos

- O validador externo lê arquivos locais, `meta.json` e `catalog/content-policy.json` (scripts/validate-external-agents.mjs:18). A Action não envia fonte a API nem exige credenciais (README.md:41-44).
- A exportação lê `.agentskit/live-cycle/<id>/iteration-N/reviewer-verdict.json` da raiz (ou de `--source`) e grava `validation/evidence.json` com `schemaVersion: 1` (scripts/lib/validation-evidence.mjs:13, :25; scripts/export-validation-evidence.mjs:8-9, :20-22). Só entra veredito aprovado, com score ≥ 95, confiança ≥ 0.95 e sem falhas críticas (scripts/lib/validation-evidence.mjs:4-5, :43-53).
- Variáveis de ambiente: os validadores não leem nenhuma. O replay lê os **nomes** `AGENTSKIT_EVAL_PROVIDER`, `AGENTSKIT_EVAL_MODEL`, `AGENTSKIT_EVAL_API_KEY`, `AGENTSKIT_EVAL_BASE_URL`, `OPENAI_EVAL_MODEL` e a chave do provedor, no formato `<PROVIDER>_API_KEY` (scripts/lib/resolve-live-adapter.mjs:103-124; scripts/run-eval.mjs:10-11).
- O modo padrão (replay) usa `eval.cassette.json` versionado em cada `registry/<id>/` e não precisa de chave. `--live` e `--record` exigem credenciais e chamam o provedor pela rede (scripts/run-eval.mjs:6-8, :33).

## Como mexer (para agentes)

- Comece por `scripts/validate-agents.mjs` (repo), `scripts/lib/external-agent-validation.mjs` (Action) e `scripts/lib/validation-evidence.mjs` (evidência).
- Estrutura exigida: `agent.ts`, `meta.json`, `agent.test.ts`, `README.md` (scripts/validate-agents.mjs:14) e campos mínimos de `meta.json` (:15). O validador não exige `eval.ts`, embora CONTRIBUTING.md:44-45 o peça para promover a `validated`. Não trate a validação estrutural como prova de eval.
- Invariantes: evidência só vale com `approved`, score ≥ 95 e confiança ≥ 0.95 (scripts/lib/validation-evidence.mjs:4-5, :43-53). Caminhos em `meta.files` precisam ficar dentro da pasta do agente (scripts/lib/external-agent-validation.mjs:113-117). Categorias e padrões bloqueados vêm de `catalog/content-policy.json` (scripts/lib/external-agent-validation.mjs:119-130).
- Testes: `scripts/lib/external-agent-validation.test.mjs` (usa fixture inline; não há fixture de Action versionada) e `scripts/lib/validation-evidence.test.mjs`. `scripts/validate-agents.mjs` não tem teste próprio.
- Comandos reais: `npm run validate` (package.json:28); `npm test` (package.json:30); replay `npm run eval:run -- --ecosystem-doc-bridge` (package.json:23; scripts/run-eval.mjs:12); lint `npm run lint` (package.json:32).
- Armadilha: as regras estruturais estão duplicadas em `scripts/validate-agents.mjs:14-15` e `scripts/lib/external-agent-validation.mjs:5-6`. Ao mudar uma, mude a outra.
- Evidência privada, credenciais, prompts e consultas de usuários não podem entrar em artefatos (AGENTS.md:15).
- Para alteração externa, confira também `action.yml` e rode `node scripts/validate-external-agents.mjs <workspace> <path>` sobre uma pasta de teste local. O CI do projeto é `.github/workflows/ci.yml`.

## Decisões e história

Não existem ADRs locais em `docs/adr/`. A fronteira essencial é exigir evidência pública para claims validados e nunca publicar revisão bruta (AGENTS.md:15).

| Data | Commit | Mudança |
|---|---|---|
| 2026-08-30 | 82616de | adota verificação documental Doc Bridge (#137) |
| 2026-07-22 | d41e477 | adiciona Action reutilizável para validar agentes externos |
| 2026-07-13 | 1454316 | publica evidência independente de validação (#74) |

Histórico: `git log -- scripts/validate-agents.mjs scripts/lib/external-agent-validation.mjs scripts/lib/validation-evidence.mjs`. O commit 6bdae66 (2026-09-02) não aparece nesse histórico; ele toca os caminhos de descoberta.

## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/validate-agents.mjs:14-15` define arquivos e campos exigidos.
> - `scripts/lib/external-agent-validation.mjs:40` resolve a raiz; `:52` inicia a verificação externa.
> - `scripts/lib/validation-evidence.mjs:4-5` declara os limites mínimos de score e confiança.
> - `action.yml:22` executa o validador externo.

> [!bug] Existe, mas ninguém usa
> `reviewRequiredCategories` em `catalog/content-policy.json:38` (clinical, legal, fintech, insurance, compliance, cybersecurity) não é lido por nenhum arquivo versionado; a busca cobre todo o repositório. A nota do próprio arquivo (`catalog/content-policy.json:46`) diz que essas categorias ficam draft até o `eval.ts` passar, e nenhum código verifica isso.
