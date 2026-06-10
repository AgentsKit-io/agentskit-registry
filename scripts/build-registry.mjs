#!/usr/bin/env node
/**
 * Build the hosted registry index that `agentskit add <agent>` fetches.
 *
 * For each `registry/<id>/meta.json`, validates it, inlines the source of every
 * file it lists, and writes `public/r/<id>.json`. Also writes `public/r/index.json`
 * (the gallery + `agentskit list` source). These are served at
 * `https://registry.agentskit.io/r/*`.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registryDir = join(root, 'registry')
const outDir = join(root, 'public', 'r')
const REQUIRED = ['id', 'title', 'description', 'category', 'packages', 'files']

mkdirSync(outDir, { recursive: true })

const ids = readdirSync(registryDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const index = []

for (const id of ids) {
  const dir = join(registryDir, id)
  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) throw new Error(`${id}: missing meta.json`)
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'))

  for (const key of REQUIRED) {
    if (meta[key] == null) throw new Error(`${id}: meta.json missing required field "${key}"`)
  }
  if (meta.id !== id) throw new Error(`${id}: meta.id "${meta.id}" must match folder name`)

  const files = meta.files.map((rel) => {
    const p = join(dir, rel)
    if (!existsSync(p)) throw new Error(`${id}: listed file "${rel}" does not exist`)
    return { path: rel, content: readFileSync(p, 'utf8') }
  })

  writeFileSync(join(outDir, `${id}.json`), JSON.stringify({ ...meta, sources: files }, null, 2) + '\n')
  const { files: _f, ...summary } = meta
  index.push(summary)
}

writeFileSync(join(outDir, 'index.json'), JSON.stringify({ agents: index }, null, 2) + '\n')
console.log(`registry built: ${ids.length} agents → public/r/ (${ids.join(', ')})`)
