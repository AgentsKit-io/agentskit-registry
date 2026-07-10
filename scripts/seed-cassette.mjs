#!/usr/bin/env node
/**
 * Seed eval.cassette.json from offline mock (no API key).
 * Usage: node scripts/seed-cassette.mjs <id> [id2...] | --ecosystem-doc-bridge | --all
 */
import { readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PACKS, parsePackArgs, seedCassette } from './lib/eval-runner.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function allEvalAgents() {
  return readdirSync(join(root, 'registry'))
    .filter((id) => {
      try {
        return statSync(join(root, 'registry', id, 'eval.ts')).isFile()
      } catch {
        return false
      }
    })
}

const args = process.argv.slice(2)
let { ids } = parsePackArgs([...args, '--replay'])

if (args.includes('--all')) {
  ids = allEvalAgents()
}

if (!ids.length) {
  console.error('No agent ids specified.')
  process.exit(1)
}

let failed = 0
for (const id of ids) {
  try {
    const { path, entries } = await seedCassette(root, id)
    console.log(`✓ ${id}: ${entries} entries → ${path.replace(root + '/', '')}`)
  } catch (e) {
    failed++
    console.log(`✗ ${id}: ${e.message}`)
  }
}

process.exit(failed ? 1 : 0)