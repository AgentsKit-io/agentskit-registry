#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = join(root, 'public/r/index.json')
if (!existsSync(indexPath)) {
  console.error('public/r/index.json is missing — run npm run build first')
  process.exit(1)
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'))
const agents = Array.isArray(index) ? index : index.agents ?? index.items ?? []
const research = agents.find((agent) => (agent.id ?? agent.name) === 'research')
if (!research) {
  console.error('research agent is not present in the public catalog index')
  process.exit(1)
}
console.log(`Verified Registry catalog contains research (${agents.length} indexed entries).`)
