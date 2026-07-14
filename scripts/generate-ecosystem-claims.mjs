#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'ecosystem.json'), 'utf8'))
const index = JSON.parse(readFileSync(join(root, 'public/r/index.json'), 'utf8'))
const categories = new Set(index.agents.map((agent) => agent.category))

const evidence = (path, summary) => ({
  type: 'repository-derivation',
  repo: 'AgentsKit-io/agentskit-registry',
  path,
  summary,
})

const registryClaims = [
  {
    id: 'validated-agents',
    value: index.stats.validated,
    noun: 'validated agents',
    conservativeFloor: 300,
    evidence: evidence('scripts/build-registry.mjs', 'Installable non-draft agent bundles emitted in public/r/index.json.'),
  },
  {
    id: 'independently-reviewed-agents',
    value: index.stats.independentlyReviewed,
    noun: 'independently reviewed agents',
    conservativeFloor: 300,
    evidence: evidence('validation/evidence.json', 'Approved public validation summaries joined into the generated index.'),
  },
  {
    id: 'agent-categories',
    value: categories.size,
    noun: 'agent categories',
    evidence: evidence('public/r/index.json', 'Distinct categories in the generated installable agent index.'),
  },
]

const ledger = {
  schemaVersion: 1,
  manifestSchemaVersion: manifest.schemaVersion,
  products: manifest.products.map((product) => product.id === 'registry'
    ? {
        productId: product.id,
        source: { type: 'endpoint', url: 'https://registry.agentskit.io/r/index.json' },
        verification: 'verified',
        claims: registryClaims,
      }
    : {
        productId: product.id,
        source: product.surfaces?.stats
          ? { type: 'endpoint', url: product.surfaces.stats }
          : { type: 'repository', repo: product.repo },
        verification: 'declared',
        claims: [],
      }),
}

writeFileSync(join(root, 'ecosystem-claims.json'), `${JSON.stringify(ledger, null, 2)}\n`)
console.log(`ecosystem claims generated: ${registryClaims.length} verified Registry claims`)
