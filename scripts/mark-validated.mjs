#!/usr/bin/env node
/** Add status: validated to shipped agents that lack an explicit status. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REG = join(dirname(fileURLToPath(import.meta.url)), '..', 'registry')
let updated = 0

for (const id of readdirSync(REG).filter((d) => statSync(join(REG, d)).isDirectory())) {
  const metaPath = join(REG, id, 'meta.json')
  let meta
  try {
    meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  } catch {
    continue
  }
  if (meta.status) continue
  meta.status = 'validated'
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
  updated++
  console.log(`validated: ${id}`)
}

console.log(`marked ${updated} agents as validated`)