---
tipo: global
repo: agentskit-registry
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: auditoria estática (leitura dos arquivos, git grep e git log); nenhum build, teste, eval ou índice Doc Bridge executado; auditado em 2026-10-16
fontes: ["AGENTS.md", "CONTRIBUTING.md", "README.md", "docs/architecture.md", "docs/for-agents/registry-catalog.md", "docs/for-agents/registry-validation.md", "package.json", "action.yml", ".github/workflows/ci.yml", "catalog/content-policy.json", "scripts/build-registry.mjs", "scripts/build-discovery.mjs", "scripts/generate-catalog.mjs", "scripts/validate-catalog.mjs", "scripts/validate-agents.mjs", "scripts/validate-external-agents.mjs", "scripts/lib/deterministic-discovery.mjs", "scripts/lib/external-agent-validation.mjs", "scripts/lib/validation-evidence.mjs", "scripts/export-validation-evidence.mjs", "scripts/run-eval.mjs", "scripts/lib/resolve-live-adapter.mjs"]
tags: [global, repo/agentskit-registry]
---

# Auditoria - agentskit-registry

> [!tldr] Em linguagem comum
> Revisão das notas do repositório agentskit-registry contra o código. Registra o que estava errado, o que foi corrigido, o que foi removido por não ser verificável e o que ainda falta.

← [[00 Hub - agentskit-registry]]

## Auditoria v2 — 2026-10-16

**Escopo.** 8 notas em `.brain/repos/agentskit-registry/`: 1 hub, 3 pacotes, 2 fluxos e 2 guias. Commit auditado: `08d7f62`. O código é o mesmo de `49952c7`: `git diff --stat 49952c7 HEAD` mostra só mudanças em `.brain/`.

**Método.** Cada `arquivo:linha` foi aberto no arquivo citado (leitura com offset ou `git grep -n`). Os símbolos de "API e contratos" foram conferidos no código. Os comandos de "Como mexer" e dos guias foram conferidos em `package.json`, `.github/workflows/ci.yml` e `action.yml`. Nenhum comando foi executado. O shell da sessão bloqueou `sed`, `find`, `ls` e pipes; as verificações usaram leitura de arquivo e `git grep`/`git log`.

### Contagens

| Métrica | Valor |
|---|---|
| Notas auditadas | 8 |
| Referências `arquivo:linha` verificadas (notas originais) | 137 |
| Referências erradas corrigidas | 29 |
| Símbolos verificados | 7 (3 em descoberta, 4 em validação) + 1 CLI (`validate-external-agents.mjs`) |
| Comandos de "Como mexer"/guias verificados | 16 scripts npm, mais `action.yml` e a flag `--ecosystem-doc-bridge` (todos existem; ver lista abaixo) |
| Claims corrigidos | 14 |
| Claims removidos por não verificáveis | 4 |

Comandos verificados: `npm run build`, `discovery:build`, `docs:bridge:config`, `catalog:generate`, `catalog:validate`, `eval:run`, `eval:run -- --ecosystem-doc-bridge`, `validate`, `pretest`, `test`, `test:quickstart`, `lint`, `check:no-legacy-chat-imports`, `docs:bridge:index`, `docs:bridge:gate`, `docs:bridge:conformance`, além de `uses:` e `with:` do `action.yml` e a flag `--ecosystem-doc-bridge` (`scripts/lib/eval-runner.mjs:19`).

### Referências erradas corrigidas (29)

Exemplos, com o antes e o depois:

| Nota | Antes | Depois | Motivo |
|---|---|---|---|
| Hub | `README.md:80` | `README.md:134-136` | linha 80 é cerca de código; a frase fala de quem é dono de runtime/CLI |
| Hub | `AGENTS.md:9` | `AGENTS.md:13-14` | linha 9 é a regra "não recriar runtime" |
| Hub | `docs/architecture.md:23` | `docs/architecture.md:30` | linha 23 descreve `registry/<id>`, não o CLI |
| Hub | `AGENTS.md:13` (Doc Bridge) | `AGENTS.md:21` | linha 13 trata de artefatos gerados |
| Catálogo | `scripts/build-registry.mjs:29` | `:168-186` | linha 29 é comentário de tipo; a fusão do catálogo está em 168-186 |
| Catálogo | `docs/for-agents/registry-catalog.md:1` | `:10-12` | linha 1 é o título |
| Descoberta | `scripts/build-registry.mjs:325` | `:327-331` | linha 325 é `const deterministicDir`; as escritas estão em 327-331 |
| Descoberta | `docs/architecture.md:19` | (removida) | linha 19 é o fim do bloco Mermaid; a afirmação não existe no texto |
| Validação | `AGENTS.md:12` | `README.md:68-70` / `AGENTS.md:15` | linha 12 trata de protocolo de chat, não de evidência |
| Validação | `docs/for-agents/registry-validation.md:7` | `:10` | linha 7 é propósito; a fonte da verdade está em 10 |
| Fluxo contribuição | `scripts/validate-agents.mjs:13` | `:14-15` | linha 13 é a raiz `REG` |
| Fluxo descoberta | `scripts/build-discovery.mjs:11` | `:16-18` | linha 11 é a raiz; as escritas estão em 16-18 |
| Guia contribuir | `ci.yml:20` (Node 22) | `ci.yml:22` | linha 20 é o `uses:`; a versão está em 22 |
| Guia contribuir | `ci.yml:25` (quickstart, conformance) | `:32`, `:38` | linha 25 é o check de imports legados |
| Guia regenerar | `package.json:42` (ak-docs) | `package.json:46` | linha 42 é o cabeçalho de `devDependencies` |
| Guia regenerar | `scripts/build-discovery.mjs:11` | `:16-18` | mesmo caso do fluxo |

Os demais 13 casos: linhas erradas por poucas linhas, ou faixas incompletas em `package.json`, `ci.yml` e `docs/architecture.md`.

### Claims corrigidos

| Nota | O que estava errado | O que é verdade | Evidência |
|---|---|---|---|
| Catálogo | "só agentes válidos e instaláveis entram no índice" | O índice recebe todo status diferente de `draft`; `installable` vale só para `alpha` e `validated`. CONTRIBUTING diz só `validated`: divergência em Dúvida | `scripts/build-registry.mjs:115-116, :141-156`; `CONTRIBUTING.md:34-36` |
| Catálogo | Validação "valida fontes antes da geração" | O build só lê a evidência (`readValidationManifest`); os validadores rodam em `npm run validate` | `scripts/build-registry.mjs:13, :45`; `package.json:28` |
| Catálogo | Efeitos omitidos | Apaga `public/r/*.json` órfãos e grava `robots.txt`, `llms*.txt` | `scripts/build-registry.mjs:238-244, :254-306` |
| Catálogo | Faltava aviso de `catalog:generate` | Reescreve `catalog/manifest.json` com todo spec `draft`; `VALIDATED_IDS` só entra em estatísticas | `scripts/generate-catalog.mjs:21, :35, :464, :467, :474` |
| Descoberta | SHA-256 "não comprova autoria" | Afirmação sem fonte. Ficou o hash de conteúdo e o limite de bytes | `docs/architecture.md:27-29, :54-55`; `scripts/lib/deterministic-discovery.mjs:202-208` |
| Descoberta | "1.024 entradas" tratado como checado | O limite de entradas vem da doc; o código só checa bytes | `scripts/lib/deterministic-discovery.mjs:206-208` |
| Descoberta | Consumidores "não confirmados" | Dentro do repo: `build-registry.mjs` e `build-discovery.mjs` importam o módulo | `scripts/build-registry.mjs:14-18`; `scripts/build-discovery.mjs:5-9` |
| Validação | "Nenhuma variável de ambiente é declarada" | Falso: o replay lê `AGENTSKIT_EVAL_*` e `<PROVIDER>_API_KEY` | `scripts/run-eval.mjs:10-11`; `scripts/lib/resolve-live-adapter.mjs:103-124` |
| Validação | `normalizeValidationVerdict` "normaliza veredito de replay" | Aplica o limite do revisor independente (aprovado, score ≥ 95, confiança ≥ 0.95) | `scripts/lib/validation-evidence.mjs:4-5, :41-68` |
| Validação | "teste a Action com fixture" | Não há fixture de Action versionada; os testes usam fixture inline | `scripts/lib/external-agent-validation.test.mjs:10-26` |
| Validação | Histórico com 6bdae66 | Esse commit não toca os caminhos de validação | `git log -- <caminhos de validação>` |
| Validação | Duas regras estruturais tratadas como uma | `validate-agents.mjs` e `external-agent-validation.mjs` duplicam as regras | `scripts/validate-agents.mjs:14-15`; `scripts/lib/external-agent-validation.mjs:5-6` |
| Fluxo contribuição | "status validado exige evidência" (implicando enforcement) | A política pede evidência; o build só anexa se existir | `scripts/build-registry.mjs:125-132` |
| Guia contribuir | `git diff` sem `doc-bridge.config.json` | O CI compara também `doc-bridge.config.json` | `.github/workflows/ci.yml:40` |

### Claims removidos por não verificáveis

- "SHA-256 ... não comprova autoria" (descoberta, Limites e Dados). Não há base no texto citado.
- "teste a Action com fixture" (validação). Não existe fixture versionada.
- "Replay pode usar fixtures/cassettes locais, conforme scripts de eval" (validação). Substituído pelo fluxo real: `eval.cassette.json` por agente e flags `--live`/`--record`.
- Frase inacabada "Resumo do log mais recente nos caminhos ..." (descoberta e validação). Substituída pela referência ao `git log` com os caminhos.

Também ficou como não reproduzida a afirmação do hub de que "a instalação falhou por rede indisponível". Ela foi mantida como Dúvida, sem afirmar a causa.

### Lacunas de cobertura

**Pacotes sem nota** (mais de 3, então listados e não escritos). Todos em `scripts/`, salvo indicação:

- Eval e replay: `run-eval.mjs` (só citado), `lib/eval-runner.mjs`, `lib/resolve-live-adapter.mjs`, `lib/cassette-seed.mjs`, `seed-cassette.mjs`, `validate-v1.mjs`, `promote-v1.mjs`, `mark-validated.mjs`.
- Projeções de runner: `lib/runner-projections.mjs` (usado por `build-registry.mjs:19` e `external-agent-validation.mjs:3`).
- Claims e doc-bridge: `generate-ecosystem-claims.mjs` (passo do `build`), `generate-doc-bridge-config.mjs` (passo do CI), `ecosystem-claims.json`.
- Geração e scaffolding: `scaffold-draft.mjs`, `batch-implement.mjs`, `enhance-v1-all.mjs`, `lib/v1-enhance.mjs`, `lib/agent-archetypes.mjs`.
- Padrão de README: `check-readme-standard.mjs`, `refresh-readme-standard.mjs`, `lib/readme-standard.mjs`, `examples/verify-readme.mjs`.
- Gate de imports: `check-no-legacy-chat-imports.mjs` (tem gate no CI, sem nota própria).
- Agentes em `registry/<id>/` (346 pastas segundo README.md:11): não têm nota individual. Decidir se entram no escopo.

**Fluxos sem nota:** (a) validação de agente externo pela Action (`action.yml` → `validate-external-agents.mjs` → `external-agent-validation.mjs`); (b) replay de eval por agente (`run-eval.mjs` → `eval-runner.mjs` → cassetes); (c) evidência independente (`.agentskit/live-cycle/` → `export-validation-evidence.mjs` → `validation/evidence.json` → build).

**ADRs:** não há arquivos em `docs/adr/`. Nada a cobrir.

**Links que não resolvem nesta worktree:** `[[00 Hub - Ecossistema AgentsKit]]`, `[[00 Hub - agentskit]]`, `[[00 Hub - agentskit-chat]]` e `[[00 Hub - doc-bridge]]` apontam para notas de outros repositórios. Esta worktree só tem `.brain/repos/agentskit-registry/`, então não foi possível rodar `check-links` aqui.

### Confiança por nota

| Nota | Confiança | Motivo |
|---|---|---|
| 00 Hub - agentskit-registry | média | Referências corrigidas; links cruzados não verificáveis nesta worktree |
| registry-catalogo | média | Código conferido; divergência de contrato em aberto (Dúvida) |
| registry-descoberta | alta | Símbolos, linhas e efeitos conferidos; consumidores internos mapeados |
| registry-validacao | média | Código conferido; duas implementações de regras e `reviewRequiredCategories` sem uso |
| Registry - Da contribuição ao bundle | alta | Comandos e linhas conferidos |
| Registry - Descoberta sem IA | alta | Linhas e limites conferidos |
| Contribuir e validar um agente | média | Comandos conferidos por leitura, não executados |
| Regenerar catálogo e descoberta | média | Comandos conferidos por leitura; `catalog:generate` tem efeito destrutivo, documentado |

### Dúvidas abertas

> [!question] Dúvida
> - Índice de instalação: o código inclui todo status não-`draft`, e CONTRIBUTING.md:34-36 diz só `validated`. Qual regra vale?
> - `reviewRequiredCategories` (`catalog/content-policy.json:38`) não é lido por nenhum script. Deveria ser aplicado?
> - Nenhum build, teste ou índice Doc Bridge foi executado nesta auditoria. A confiança das notas de comando é de leitura.
