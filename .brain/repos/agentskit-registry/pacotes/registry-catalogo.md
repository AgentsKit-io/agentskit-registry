---
tipo: pacote
repo: agentskit-registry
camada: ferramenta
visibilidade: publico
verificado-em: 2026-10-16
commits: { agentskit-registry: 08d7f62 }
metodo: análise estática; configuração Doc Bridge lida, índice não gerado porque instalação não concluiu; auditado em 2026-10-16
fontes: ["scripts/build-registry.mjs", "scripts/generate-catalog.mjs", "scripts/validate-catalog.mjs", "package.json", "docs/for-agents/registry-catalog.md", "AGENTS.md"]
tags: [pacote, repo/agentskit-registry, camada/ferramenta]
---

# registry-catalogo

> [!tldr] Em linguagem comum
> Mantém a lista de agentes e transforma fontes legíveis em pacotes JSON instaláveis pelo CLI.

← [[00 Hub - agentskit-registry]]

## O que faz e por que existe

O gerador percorre `registry/`, valida metadados e incorpora os arquivos indicados em bundles; gera índices públicos e projeções para consumidores. O catálogo amplo (`catalog/manifest.json`) tem ciclo draft/validated; agentes `draft` nunca são instaláveis (scripts/build-registry.mjs:141-144). O índice `public/r/index.json` recebe todo agente não-draft (scripts/build-registry.mjs:148-156), e `installable` vale só para `alpha` e `validated` (:115-116). CONTRIBUTING.md:34-36 diz que só `validated` entra no índice; a divergência está em Dúvida abaixo.

## API e contratos

| Símbolo | Tipo | Para que serve | Onde |
|---|---|---|---|
| `scripts/build-registry.mjs` | CLI Node ESM | Gera bundles, índices, llms e conhecimento determinístico | package.json:14 |
| `scripts/generate-catalog.mjs` | CLI Node ESM | Gera manifesto do catálogo | package.json:18 |
| `scripts/validate-catalog.mjs` | CLI Node ESM | Confere catálogo | package.json:19 |

Exemplo real: `npm run build` executa `node scripts/build-registry.mjs && node scripts/generate-ecosystem-claims.mjs` (package.json:14). Trecho real que decide instalabilidade (scripts/build-registry.mjs:115-116):

```js
const status = meta.status ?? 'validated'
const installable = status === 'alpha' || status === 'validated'
```

## Quem usa e do que depende

| Parte | Relação |
|---|---|
| [[registry-validacao]] | o build lê a evidência de validação (`readValidationManifest`, scripts/build-registry.mjs:13, :45); os validadores não rodam dentro do build, só em `npm run validate` (package.json:28) |
| CLI AgentsKit | consome os bundles e índice para copiar código (docs/architecture.md:30) |
| [[00 Hub - agentskit]] | hospeda a experiência visual consumidora (README.md:131-134) |
| `catalog/manifest.json` | agrega especificações e estados de agentes (scripts/build-registry.mjs:168-186) |
| `scripts/lib/runner-projections.mjs` | gera `runnerProjections` quando `meta.projections` existe (scripts/build-registry.mjs:19, :117-124) |

## Dados e efeitos

Lê `registry/<id>/meta.json` e os arquivos listados (scripts/build-registry.mjs:22, :58-61), `catalog/manifest.json` e `catalog/stacks.json` (:32, :190), `ecosystem.json` (:261) e `validation/evidence.json` (:45; leitura em scripts/lib/validation-evidence.mjs:70-80). Grava `public/r/<id>.json`, `index.json` e `catalog.json` (:146, :193, :213); apaga em `public/r/` os `.json` órfãos (:238-244); grava `public/robots.txt`, `llms.txt`, `llms-full.txt` (:254-306) e `public/deterministic/` (:327-331). Neste arquivo não há variável de ambiente nem chamada de rede (nenhum `process.env` ou `fetch`). Não requer banco. Saídas são públicas; nunca inserir segredos, prompts privados ou parecer bruto (AGENTS.md:15).

## Como mexer (para agentes)

- Entrada: `scripts/build-registry.mjs` (configuração nas linhas 21-45); contrato de contribuição: `CONTRIBUTING.md:12-17`.
- Testes: não há teste direto de `build-registry.mjs`. A cobertura é indireta, por `npm run test:quickstart` (`scripts/quickstart.test.mjs`, ci.yml:32) e pelo diff de artefatos no CI (ci.yml:39-40).
- Preserve a geração determinística e não edite `public/r` manualmente (AGENTS.md:13).
- Comandos: catálogo `npm run catalog:validate` (package.json:19); build `npm run build` (package.json:14); estrutura `npm run validate` (package.json:28).
- Armadilha: `npm run catalog:generate` (package.json:18) reescreve `catalog/manifest.json` a partir da lista fixa em `scripts/generate-catalog.mjs`. Todo spec sai com `status: 'draft'` (:21) e `generatedAt` novo (:464). A lista `VALIDATED_IDS` (:35) só alimenta `stats.validated` (:467). Revise o diff antes de commitar.
- Armadilha: o build apaga `public/r/*.json` que não corresponde a uma pasta de `registry/` (scripts/build-registry.mjs:238-244).
- Bundle de draft deve permanecer não instalável (scripts/build-registry.mjs:141-144).
- CI verifica diff de artefatos gerados (`.github/workflows/ci.yml:39-40`).

## Decisões e história

Não há ADR em `docs/adr/` neste repositório. O limite arquitetural mantém fonte/catálogo aqui e instalação/aplicação em consumidores (docs/architecture.md:3; docs/architecture.md:25).

| Data | Commit | Mudança relevante |
|---|---|---|
| 2026-09-25 | f3fd4cd | sincroniza ordem canônica do catálogo do ecossistema |
| 2026-07-09 | 5201c69 | introduz manifesto mestre e ciclo draft/validated |



## Detalhe técnico

> [!info]- Detalhe técnico
> - `scripts/build-registry.mjs:25` declara campos mínimos.
> - `scripts/build-registry.mjs:142` grava draft como não instalável.
> - `scripts/build-registry.mjs:193` compõe o índice.
> - `docs/for-agents/registry-catalog.md:10-12` aponta fontes canônicas e artefatos gerados; `:19-22` lista os comandos de checagem.

> [!question] Dúvida
> Divergência: `CONTRIBUTING.md:34-36` diz que só `validated` entra em `public/r/index.json`, mas o código (`scripts/build-registry.mjs:148-156`) inclui qualquer status diferente de `draft`. Não foi verificado se algum agente `alpha` está publicado hoje (`scripts/run-eval.mjs:28-29` usa esse status com `--alpha`). Confirmar a regra antes de alterar o código ou o contrato.

> [!bug] Existe, mas ninguém usa
> Não foi possível confirmar capacidades do catálogo que não tenham consumidores; nenhuma será classificada como não usada sem evidência.
