# AgentsKit Registry — Catálogo Mestre

> **346 agentes no catálogo** · **36 validados** · **310 alpha (instaláveis, experimental)** · **0 drafts**
> JSON: [`/r/catalog.json`](https://registry.agentskit.io/r/catalog.json) · Instaláveis: [`/r/index.json`](https://registry.agentskit.io/r/index.json)

## Modelo de publicação

| Status | `npx agentskit add` | Onde aparece |
|--------|---------------------|--------------|
| `draft` | Bloqueado | Catálogo, spec apenas |
| `alpha` | Funciona (warning) | Gallery + CLI — experimental |
| `validated` | Funciona | Produção — review completo |
| `deprecated` | Bloqueado | Histórico apenas |

**Fluxo:** spec em `catalog/manifest.json` → `npm run scaffold -- <id>` → implementar Zod real + `eval.ts` → `status: validated` → PR.

## Contrato mínimo (todo agente)

- Uma dor, um output tipado (Zod)
- Nunca inventa — lacunas viram `gaps` / `openQuestions`
- Domínios sensíveis: sempre draft + HITL
- Safety nets determinísticos onde o modelo só pode escalar
- Transport injetado para ações externas (sem ID falso)
- `agent.test.ts` + `eval.ts` antes de validar

## Política de conteúdo (bloqueado)

Ver [`content-policy.json`](./content-policy.json). Rejeitamos automaticamente:

- Armas, adulto, campanha política, atividade ilegal
- Ódio/assédio, segurança infantil, stalking
- Gambling (catálogo aberto)

Categorias reguladas (`clinical`, `legal`, `fintech`, `compliance`) exigem curadoria + `eval.ts`.

## Stacks (workflows compostos)

14 stacks em [`stacks.json`](./stacks.json). Instale os átomos, ligue no AKOS ou no seu orchestrator.

| Stack | Verticais |
|-------|-----------|
| `stack-coding-ship` | PRD → issues → specs → code → QA → review → release |
| `stack-marketing-campaign` | Brief → research → copy → review → publish |
| `stack-ecosystem-doc-bridge` | Corpus → memory → handoff → knowledge-promoter |
| `stack-ecosystem-registry-growth` | Spec → eval → playbook audit |
| `stack-compliance-lgpd` | LGPD assess → DPA → retention → breach BR |

## Dogfood do ecossistema

Agentes `ecosystem-*` alimentam propriedades AgentsKit:

| Agente | Serve |
|--------|-------|
| `ecosystem-doc-bridge-memory-classifier` | doc-bridge: memory candidates |
| `ecosystem-doc-bridge-handoff-author` | doc-bridge: agent-handoff-v1 |
| `ecosystem-playbook-alignment-auditor` | playbook.agentskit.io |
| `ecosystem-registry-agent-spec-author` | Novos agentes no registry |
| `ecosystem-registry-eval-author` | Casos eval antes de validar |
| `knowledge-promoter` | Private notes → docs públicos |

## Verticais e contagem

| Categoria | Draft | Validated | Total alvo |
|-----------|-------|-----------|------------|
| coding | 18 | 8 | 26 |
| research | 14 | 1 | 15 |
| marketing | 12 | 5 | 17 |
| agency | 8 | 4 | 12 |
| support | 10 | 3 | 13 |
| legal | 10 | 5 | 15 |
| fintech | 10 | 3 | 13 |
| clinical | 10 | 5 | 15 |
| ops | 12 | 1 | 13 |
| productivity | 4 | 1 | 5 |
| sales | 25 | 0 | 25 |
| hr | 20 | 0 | 20 |
| devops | 20 | 0 | 20 |
| data | 20 | 0 | 20 |
| ecommerce | 18 | 0 | 18 |
| product | 15 | 0 | 15 |
| cybersecurity | 15 | 0 | 15 |
| insurance | 15 | 0 | 15 |
| realestate | 12 | 0 | 12 |
| education | 12 | 0 | 12 |
| content | 12 | 0 | 12 |
| compliance | 8 | 0 | 8 |
| ecosystem | 10 | 0 | 10 |

## Locais (global + regional)

Incluídos no catálogo, não genéricos:

- `compliance-lgpd-assessor` (BR)
- `compliance-lgpd-dpa-reviewer` (BR)
- `compliance-breach-notification-br` (BR, 72h ANPD)
- `compliance-gdpr-dpia-drafter` (EU)

## Prioridade de validação (fase 1)

1. **Ecosystem** — doc-bridge + playbook + registry loop
2. **Coding gaps** — incident postmortem, dependency auditor, security interpreter
3. **Research** — due diligence, regulatory tracker, vendor evaluation
4. **Support gaps** — macro suggester, bug repro, churn risk
5. **Compliance LGPD pack** — stack completo BR

## Comandos

```bash
npm run catalog:generate   # regenera manifest.json
npm run catalog:validate   # política de conteúdo
npm run scaffold -- <id>   # código draft em registry/<id>/
npm run build              # public/r/index.json + catalog.json
```

## Contribuir

1. Escolha um agente `draft` em `manifest.json`
2. `npm run scaffold -- <id>`
3. Implemente o schema Zod real (substitua o placeholder)
4. Adicione `eval.ts` com 5+ casos
5. PR com `status: validated`