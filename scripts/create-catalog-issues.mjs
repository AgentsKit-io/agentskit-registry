#!/usr/bin/env node
/**
 * Creates GitHub epic + per-category sub-issues for the agent catalog.
 * Usage: node scripts/create-catalog-issues.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')
const REPO = 'AgentsKit-io/agentskit-registry'

const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))
const stacks = JSON.parse(readFileSync(join(root, 'catalog', 'stacks.json'), 'utf8')).stacks ?? []
const policy = JSON.parse(readFileSync(join(root, 'catalog', 'content-policy.json'), 'utf8'))

let validated = new Set()
/** @type {Map<string, object>} */
const validatedById = new Map()
try {
  const index = JSON.parse(readFileSync(join(root, 'public', 'r', 'index.json'), 'utf8'))
  for (const a of index.agents) {
    validated.add(a.id)
    validatedById.set(a.id, {
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      status: 'validated',
      pain: 'Já implementado — ver descrição no registry.',
      output: a.description,
      gates: ['typed-output', 'never-invent'],
      tags: a.tags ?? [a.category],
      packages: a.packages ?? ['@agentskit/core', '@agentskit/runtime', '@agentskit/tools'],
      integrations: [],
      locale: null,
      ecosystem: false,
      priority: 'done',
    })
  }
} catch { /* ok */ }

const GATE_DOCS = {
  'typed-output': 'Saída via Zod + `invokeStructured` + `defineZodTool` — nunca texto livre como contrato.',
  'never-invent': 'Lacunas viram `gaps` / `openQuestions` / `toBeConfirmed`; nunca preencher com suposição.',
  'always-draft': 'Campo `requiresReview: true` ou disclaimer no output; nunca ação final automática.',
  'hitl': '`onConfirm` fail-closed ou `requiresApproval` antes de transport externo.',
  'cite-sources': 'Cada fato cita `sourceId` + página/URL do input.',
  'cite-metrics': 'Números só do input; sem métricas inventadas.',
  'cite-data': 'Insights ancorados em dados fornecidos.',
  'cite-lockfile': 'Findings referenciam pacote@versão do lockfile.',
  'injection-defense': '`UNTRUSTED_CONTENT_DIRECTIVE` + `fenceUntrustedContent` em conteúdo fetched.',
  'deterministic-gate': 'Regex/gate em código que só pode escalar severidade, nunca rebaixar.',
  'deterministic-gpl': 'Flag GPL/AGPL incompatível via regra fixa, não só modelo.',
  'safety-net': 'Red flags em código forçam rota humana/emergency.',
  'triage-net': 'Red flags clínicos forçam `emergency` — modelo não pode downgrade.',
  'never-diagnose': 'Interpretação factual; nunca diagnóstico; disclaimer clínico.',
  'never-files': 'Agente produz draft; nunca submete SAR/registro real.',
  'grounded-only': 'Só cita corpus do `retriever`; `noMatch` se nada encontrado.',
  'read-only-default': 'SQL/report only; sem DDL/DML destrutivo sem HITL.',
  'gaps-not-guesses': 'TAM/SAM/SOM com `assumptions[]` explícitas.',
  'no-invented-stats': 'Estatísticas sem fonte → `gaps`, não números.',
  'draft': 'Sempre rascunho para revisão humana.',
}

const CATEGORY_LABEL = {
  agency: 'vertical:agency',
  clinical: 'vertical:clinical',
  coding: 'vertical:coding',
  compliance: 'vertical:compliance',
  content: 'vertical:content',
  cybersecurity: 'vertical:security',
  data: 'vertical:data',
  devops: 'vertical:devops',
  ecommerce: 'vertical:ecommerce',
  ecosystem: 'vertical:ecosystem',
  education: 'vertical:education',
  fintech: 'vertical:fintech',
  hr: 'vertical:hr',
  insurance: 'vertical:insurance',
  legal: 'vertical:legal',
  marketing: 'vertical:marketing',
  ops: 'vertical:ops',
  product: 'vertical:product',
  productivity: 'vertical:productivity',
  realestate: 'vertical:realestate',
  research: 'vertical:research',
  sales: 'vertical:sales',
  support: 'vertical:support',
}

function stacksFor(id) {
  return stacks.filter((s) => s.agents.includes(id)).map((s) => s.id)
}

function agentSection(a) {
  const isValidated = validated.has(a.id)
  const gateLines = (a.gates ?? [])
    .map((g) => `- **${g}**: ${GATE_DOCS[g] ?? 'Ver playbook.agentskit.io e agentes validados da mesma categoria.'}`)
    .join('\n')
  const stackLines = stacksFor(a.id).map((s) => `\`${s}\``).join(', ') || '_nenhum_'
  const integrations = (a.integrations ?? []).length ? a.integrations.map((i) => `\`${i}\``).join(', ') : '_opcional — transport injetado pelo caller_'

  return `### \`${a.id}\` — ${a.title}${isValidated ? ' ✅' : ''}

| Campo | Detalhe |
|-------|---------|
| **O que é** | ${a.description} |
| **Para que serve** | ${a.pain || '—'} |
| **Output esperado** | ${a.output || '—'} |
| **Status** | ${isValidated ? '`validated` — já instalável' : '`draft` — spec no catálogo'} |
| **Locale** | ${a.locale ?? 'global'} |
| **Stacks** | ${stackLines} |

**Gates obrigatórios:**
${gateLines || '- typed-output, never-invent, always-draft'}

**Como implementar** (${isValidated ? 'referência' : 'checklist'}):
1. ${isValidated ? 'Ver registry/' + a.id + '/ como referência.' : 'npm run scaffold -- ' + a.id}
2. Substituir schema placeholder por contrato Zod real alinhado ao output esperado.
3. System prompt: uma dor, uma tool \`submit_*\`, \`UNTRUSTED_CONTENT_DIRECTIVE\`.
4. Safety net determinístico em código se categoria regulada (${a.category}).
5. \`agent.test.ts\`: mockAdapter + casos de regressão (red flags, gaps, empty input).
6. \`eval.ts\`: 5+ casos com \`@agentskit/eval\` (obrigatório antes de validar).
7. \`README.md\`: input, output, exemplo, disclaimers.
8. \`meta.json\`: \`status: validated\`, tags, packages: ${(a.packages ?? []).join(', ')}.
9. Integrações sugeridas: ${integrations}
10. PR → \`npm run validate && npm test && npm run build\`

---`
}

function byCategory() {
  const byId = new Map()
  for (const a of manifest.agents) byId.set(a.id, a)
  for (const [id, a] of validatedById) if (!byId.has(id)) byId.set(id, a)
  const map = new Map()
  for (const a of byId.values()) {
    if (!map.has(a.category)) map.set(a.category, [])
    map.get(a.category).push(a)
  }
  return map
}

function gh(args) {
  const cmd = `gh ${args}`
  if (dryRun) {
    console.log('[dry-run]', cmd.slice(0, 120) + '...')
    return '{ "number": 0, "url": "https://github.com/example" }'
  }
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
}

function ensureLabels() {
  const labels = [
    'catalog',
    'epic',
    'agent-draft',
    ...new Set(Object.values(CATEGORY_LABEL)),
  ]
  for (const label of labels) {
    try {
      gh(`label create "${label}" --repo ${REPO} --color "0E8A16" --description "Agent catalog" 2>/dev/null || true`)
    } catch { /* exists */ }
  }
}

const allAgents = byCategory()
const grouped = allAgents
const categories = [...grouped.keys()].sort()
const totalAgents = [...allAgents.values()].reduce((n, list) => n + list.length, 0)
const draftCount = totalAgents - validated.size

const epicBody = `## Objetivo

Implementar e validar o catálogo aberto de agentes do AgentsKit Registry — **${totalAgents} specs** no manifest, **${validated.size} já validados**, **${draftCount} drafts** pendentes.

Cada sub-issue abaixo cobre **uma vertical** com a spec completa de cada agente: o que é, para que serve, gates e checklist de implementação.

## Contrato mínimo (todos os agentes)

- Uma dor → um output tipado (Zod)
- Provider-agnostic (\`adapter\` no config)
- \`agent.ts\` + \`meta.json\` + \`agent.test.ts\` + \`README.md\` + \`eval.ts\` (antes de validar)
- \`status: draft\` no catálogo → \`status: validated\` só após testes + curadoria
- Bloqueados: ver \`catalog/content-policy.json\`

## Stacks (workflows)

${stacks.map((s) => `- **\`${s.id}\`**: ${s.description} (${s.agents.length} agentes)`).join('\n')}

## Sub-issues por vertical

_Esta lista será atualizada com os números das issues criadas._

## Referências

- [catalog/CATALOG.md](https://github.com/${REPO}/blob/main/catalog/CATALOG.md)
- [catalog/manifest.json](https://github.com/${REPO}/blob/main/catalog/manifest.json)
- [catalog/stacks.json](https://github.com/${REPO}/blob/main/catalog/stacks.json)
- [Authoring guide](https://registry.agentskit.io/docs/authoring)
`

const results = { epic: null, children: [] }

if (!dryRun) ensureLabels()

console.log('Creating epic...')
const epicUrl = dryRun
  ? 'https://github.com/AgentsKit-io/agentskit-registry/issues/0'
  : execSync(
      `gh issue create --repo ${REPO} --title "Epic: Catálogo de agentes — ${totalAgents} specs (${validated.size} validados, ${draftCount} drafts)" --label "catalog,epic" --body-file -`,
      { input: epicBody, encoding: 'utf8' },
    ).trim()

results.epic = epicUrl
console.log('Epic:', epicUrl)

const epicNum = dryRun ? 0 : Number(epicUrl.match(/\/issues\/(\d+)/)?.[1])

for (const cat of categories) {
  const agents = grouped.get(cat).sort((a, b) => a.id.localeCompare(b.id))
  const validatedInCat = agents.filter((a) => validated.has(a.id)).length
  const draftInCat = agents.length - validatedInCat

  const body = `## Vertical: ${cat}

Parte do epic #${epicNum || 'PARENT'}.

| Métrica | Valor |
|---------|-------|
| Agentes nesta vertical | ${agents.length} |
| Validados | ${validatedInCat} |
| Drafts | ${draftInCat} |

## Política

${policy.reviewRequiredCategories.includes(cat) ? `⚠️ Categoria **regulada** — exige \`eval.ts\` rigoroso + curadoria humana antes de \`validated\`.` : 'Categoria padrão — seguir contrato mínimo do registry.'}

---

${agents.map(agentSection).join('\n\n')}

## Definition of done (vertical)

- [ ] Todos os drafts desta vertical com código real (não placeholder schema)
- [ ] \`eval.ts\` em cada agente promovido
- [ ] \`npm run validate && npm test && npm run build\` verde
- [ ] Stacks que referenciam esta vertical atualizadas se IDs mudarem
`

  const label = CATEGORY_LABEL[cat] ?? 'catalog'
  const title = `[${cat}] Implementar ${agents.length} agentes (${draftInCat} drafts, ${validatedInCat} done)`

  console.log(`Creating: ${title}`)
  const url = dryRun
    ? `https://github.com/${REPO}/issues/0`
    : execSync(
        `gh issue create --repo ${REPO} --title ${JSON.stringify(title)} --label "catalog,agent-draft,${label}" --body-file -`,
        { input: body, encoding: 'utf8' },
      ).trim()

  results.children.push({ category: cat, url, count: agents.length })

  if (!dryRun && epicNum) {
    try {
      execSync(
        `gh api repos/${REPO}/issues/${epicNum}/sub_issues -f sub_issue_id=$(gh api repos/${REPO}/issues/${url.match(/\/issues\/(\d+)/)[1]} --jq .id) 2>/dev/null || true`,
        { stdio: 'ignore' },
      )
    } catch { /* sub-issue API may vary */ }
  }
}

// Update epic with child links
if (!dryRun && epicNum) {
  const links = results.children.map((c) => `- [${c.category}](${c.url}) — ${c.count} agentes`).join('\n')
  const updated = epicBody.replace(
    '_Esta lista será atualizada com os números das issues criadas._',
    links,
  )
  writeFileSync(join(root, '.issue-epic-body.md'), updated)
  try {
    execSync(`gh issue edit ${epicNum} --repo ${REPO} --body-file ${join(root, '.issue-epic-body.md')}`, { stdio: 'inherit' })
  } catch (e) {
    console.warn('Could not update epic body:', e.message)
  }
}

writeFileSync(join(root, 'catalog/ISSUES.json'), JSON.stringify(results, null, 2) + '\n')
console.log('\nDone:', JSON.stringify(results, null, 2))