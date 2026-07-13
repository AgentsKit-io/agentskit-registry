#!/usr/bin/env node
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readValidationEvidence } from './lib/validation-evidence.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceFlag = process.argv.indexOf('--source')
const source = resolve(sourceFlag >= 0 ? process.argv[sourceFlag + 1] : root)
const ids = readdirSync(join(source, 'registry'))
  .filter((id) => statSync(join(source, 'registry', id)).isDirectory())
  .sort()

const agents = {}
for (const id of ids) {
  const evidence = readValidationEvidence(source, id)
  if (evidence) agents[id] = evidence
}

const output = join(root, 'validation', 'evidence.json')
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, agents }, null, 2)}\n`)
console.log(`validation evidence: ${Object.keys(agents).length}/${ids.length} agents → ${output.replace(`${root}/`, '')}`)
