#!/usr/bin/env node
/**
 * Validates catalog/manifest.json against content-policy.json.
 * Run: node scripts/validate-catalog.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const policy = JSON.parse(readFileSync(join(root, 'catalog', 'content-policy.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))

const errors = []
const tagPatterns = policy.blockedTagPatterns.map((p) => new RegExp(p, 'i'))
const titlePatterns = policy.blockedTitlePatterns.map((p) => new RegExp(p, 'i'))

for (const agent of manifest.agents) {
  const ctx = agent.id
  if (policy.blockedCategories.includes(agent.category)) {
    errors.push(`${ctx}: blocked category "${agent.category}"`)
  }
  for (const tag of agent.tags ?? []) {
    if (tagPatterns.some((re) => re.test(tag))) errors.push(`${ctx}: blocked tag "${tag}"`)
  }
  if (titlePatterns.some((re) => re.test(agent.title))) errors.push(`${ctx}: blocked title pattern in "${agent.title}"`)
  if (titlePatterns.some((re) => re.test(agent.description))) errors.push(`${ctx}: blocked description pattern`)
}

if (errors.length) {
  console.error(`Catalog policy validation FAILED:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(`Catalog policy validation passed: ${manifest.agents.length} agents, 0 policy violations.`)