#!/usr/bin/env node
/**
 * Enforces the contribution bar (CONTRIBUTING.md) per agent, mechanically:
 * every `registry/<id>/` must ship agent.ts + meta.json + agent.test.ts + README.md,
 * meta.json must have the required fields, meta.id must match the folder, and every
 * file listed in meta.files must exist. `npm run build` validates meta separately
 * and inlines sources; this is the structural gate that keeps the bar honest.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REG = join(dirname(fileURLToPath(import.meta.url)), '..', 'registry')
const REQUIRED_FILES = ['agent.ts', 'meta.json', 'agent.test.ts', 'README.md']
const REQUIRED_META = ['id', 'title', 'description', 'category', 'packages', 'files']

const agents = readdirSync(REG).filter((id) => statSync(join(REG, id)).isDirectory())
const errors = []

for (const id of agents) {
  const dir = join(REG, id)
  const fail = (msg) => errors.push(`${id}: ${msg}`)

  for (const f of REQUIRED_FILES) {
    if (!existsSync(join(dir, f))) fail(`missing ${f} (required by CONTRIBUTING.md)`)
  }

  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) continue
  let meta
  try {
    meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  } catch (e) {
    fail(`meta.json is not valid JSON: ${e.message}`)
    continue
  }
  for (const k of REQUIRED_META) {
    if (meta[k] == null) fail(`meta.json missing required field "${k}"`)
  }
  if (meta.id !== id) fail(`meta.id "${meta.id}" must match the folder name "${id}"`)
  for (const rel of Array.isArray(meta.files) ? meta.files : []) {
    if (!existsSync(join(dir, rel))) fail(`meta.files lists "${rel}" but it does not exist`)
  }
}

if (errors.length) {
  console.error(`Agent validation FAILED:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log(`Agent validation passed: ${agents.length} agents have agent.ts + meta.json + agent.test.ts + README.md.`)
