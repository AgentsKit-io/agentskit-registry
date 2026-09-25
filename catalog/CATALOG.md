# AgentsKit Registry — Master Catalog

> **346 agents in the catalog** · **346 validated v1** · **0 alpha** · **0 drafts**
> JSON: [`/r/catalog.json`](https://registry.agentskit.io/r/catalog.json) · Installable: [`/r/index.json`](https://registry.agentskit.io/r/index.json)

## Publication model

| Status | `npx agentskit add` | Where it appears |
|--------|---------------------|--------------|
| `draft` | Blocked | Catalog, spec only |
| `alpha` | Works (warning) | Experimental (earlier phase) |
| `validated` | Works | **v1** — domain schema + tests + eval |
| `deprecated` | Blocked | History only |

**Flow:** spec in `catalog/manifest.json` → `npm run scaffold -- <id>` → implement the real Zod schema + `eval.ts` → `status: validated` → PR.

## Minimum contract (every agent)

- One pain point, one typed output (Zod)
- Never invents — gaps become `gaps` / `openQuestions`
- Sensitive domains: always draft + HITL
- Deterministic safety nets where the model can only escalate
- Injected transport for external actions (no fake IDs)
- `agent.test.ts` + `eval.ts` before validating

## Content policy (blocked)

See [`content-policy.json`](./content-policy.json). Automatically rejected:

- Weapons, adult content, political campaigns, illegal activity
- Hate/harassment, child safety, stalking
- Gambling (open catalog)

Regulated categories (`clinical`, `legal`, `fintech`, `compliance`) require curation + `eval.ts`.

## Stacks (composed workflows)


| Stack | Verticals |
|-------|-----------|
| `stack-coding-ship` | PRD → issues → specs → code → QA → review → release |
| `stack-marketing-campaign` | Brief → research → copy → review → publish |
| `stack-ecosystem-doc-bridge` | Corpus → memory → handoff → knowledge-promoter |
| `stack-ecosystem-registry-growth` | Spec → eval → playbook audit |
| `stack-compliance-lgpd` | LGPD assess → DPA → retention → breach BR |

## Ecosystem dogfood

`ecosystem-*` agents feed AgentsKit properties:

| Agent | Serves |
|--------|-------|
| `ecosystem-doc-bridge-memory-classifier` | doc-bridge: memory candidates |
| `ecosystem-doc-bridge-handoff-author` | doc-bridge: agent-handoff-v1 |
| `ecosystem-playbook-alignment-auditor` | playbook.agentskit.io |
| `ecosystem-registry-agent-spec-author` | New agents in the registry |
| `ecosystem-registry-eval-author` | Eval cases before validating |
| `knowledge-promoter` | Private notes → public docs |

## Verticals and counts

| Category | Draft | Validated | Target total |
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

## Regional (global + local)

Included in the catalog, not generic:

- `compliance-lgpd-assessor` (BR)
- `compliance-lgpd-dpa-reviewer` (BR)
- `compliance-breach-notification-br` (BR, 72h ANPD)
- `compliance-gdpr-dpia-drafter` (EU)

## Validation priority (phase 1)

1. **Ecosystem** — doc-bridge + playbook + registry loop
2. **Coding gaps** — incident postmortem, dependency auditor, security interpreter
3. **Research** — due diligence, regulatory tracker, vendor evaluation
4. **Support gaps** — macro suggester, bug repro, churn risk
5. **Compliance LGPD pack** — full BR stack

## Commands

```bash
npm run catalog:generate   # regenerates manifest.json
npm run catalog:validate   # content policy
npm run scaffold -- <id>   # draft code in registry/<id>/
npm run build              # public/r/index.json + catalog.json
```

## Contributing

1. Pick a `draft` agent in `manifest.json`
2. `npm run scaffold -- <id>`
3. Implement the real Zod schema (replace the placeholder)
4. Add `eval.ts` with 5+ cases
5. Open a PR with `status: validated`
