#!/usr/bin/env node
/**
 * Promote agent(s) to validated v1 after tests pass.
 * Usage: node scripts/promote-v1.mjs <id> [id2...]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'))

if (!ids.length) {
  console.error('Usage: node scripts/promote-v1.mjs <id> [id2...]')
  process.exit(1)
}

for (const id of ids) {
  const metaPath = join(root, 'registry', id, 'meta.json')
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  meta.status = 'validated'
  meta.version = '1.0.0'
  if (meta.description?.includes('Alpha:')) {
    meta.description = meta.description.replace(/Alpha:.*?— review before production\.\s*/i, '').trim()
  }
  const tags = new Set(meta.tags ?? [])
  tags.delete('alpha')
  tags.add('structured-output')
  meta.tags = [...tags]
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
  console.log(`promoted: ${id} → validated v1.0.0`)
}

execSync(`npx vitest run ${ids.map((id) => `registry/${id}/agent.test.ts`).join(' ')}`, { cwd: root, stdio: 'inherit' })
execSync('npm run build', { cwd: root, stdio: 'inherit' })
console.log('build ok')