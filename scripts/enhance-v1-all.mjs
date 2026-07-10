#!/usr/bin/env node
/**
 * Enhance all alpha agents to v1 validated quality and run full test suite.
 * Skips agents already validated. Preserves handcrafted registry/ecosystem-* overrides.
 * Usage: node scripts/enhance-v1-all.mjs [--category X] [--skip-handcrafted]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import {
  factoryName,
  toolName,
  schemaFor,
  generateV1Agent,
  generateV1Test,
  generateV1Eval,
  generateV1Meta,
} from './lib/v1-enhance.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))
const catFilter = process.argv.find((a, i) => process.argv[i - 1] === '--category')
const skipHandcrafted = process.argv.includes('--skip-handcrafted')

const HANDCRAFTED = new Set([
  'ecosystem-doc-bridge-memory-classifier',
])

let targets = manifest.agents
if (catFilter) targets = targets.filter((a) => a.category === catFilter)

const ORIGINAL_VALIDATED = new Set([
  'agency-brief-generator', 'agency-copy-reviewer', 'agency-deck-builder', 'agency-schedule-planner',
  'clinical-chart-redactor', 'clinical-intake-triage', 'clinical-note-summariser', 'clinical-patient-summary',
  'clinical-referral-router', 'code-review', 'coding-code-qa', 'coding-dev-implementer', 'coding-issue-creator',
  'coding-prd-author', 'coding-qa-author', 'coding-release-notes-drafter', 'coding-test-runner', 'docs-chat',
  'fintech-kyc-screener', 'fintech-sanctions-screener', 'fintech-transaction-investigator', 'knowledge-promoter',
  'legal-case-analyst', 'legal-case-summariser', 'legal-doc-drafter', 'legal-doc-reviewer', 'legal-redaction-bot',
  'marketing-brief-analyst', 'marketing-calendar-digest-author', 'marketing-competitor-researcher',
  'marketing-copy-author', 'marketing-social-publisher', 'research', 'support-escalation-drafter',
  'support-kb-searcher', 'support-triage-bot',
])

targets = targets.filter((a) => !ORIGINAL_VALIDATED.has(a.id))
if (skipHandcrafted) targets = targets.filter((a) => !HANDCRAFTED.has(a.id))
else targets = targets.filter((a) => !HANDCRAFTED.has(a.id))

console.log(`Enhancing ${targets.length} agents to v1 validated...`)

for (const spec of targets) {
  if (HANDCRAFTED.has(spec.id)) {
    console.log(`  skip handcrafted: ${spec.id}`)
    continue
  }
  const factory = factoryName(spec.id)
  const tool = toolName(spec.id)
  const schema = schemaFor(spec)
  const dir = join(root, 'registry', spec.id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'agent.ts'), generateV1Agent(spec, schema, tool, factory))
  writeFileSync(join(dir, 'agent.test.ts'), generateV1Test(spec, factory, tool, schema))
  writeFileSync(join(dir, 'eval.ts'), generateV1Eval(spec))
  writeFileSync(join(dir, 'meta.json'), JSON.stringify(generateV1Meta(spec), null, 2) + '\n')
  const readme = `# ${spec.title}\n\n> **v1 validated** — \`npx agentskit add ${spec.id}\`\n\n## Pain\n${spec.pain}\n\n## Output\n${spec.output}\n`
  writeFileSync(join(dir, 'README.md'), readme)
}

console.log('Running full validation...')
execSync('npm run validate && npm test && npm run build', { cwd: root, stdio: 'inherit' })
console.log(`Done. ${targets.length} agents promoted to validated v1.`)